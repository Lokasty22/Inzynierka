const { mockRequest, mockResponse } = require("jest-mock-req-res");
const { getCodeByName } = require("../controllers/giftcardController");
const Giftcard = require("../models/giftcards");
const { User } = require("../models/user");

jest.mock("../models/giftcards");
jest.mock("../models/user");

describe("getCodeByName Controller", () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest({
      query: { code: "VALIDCODE123" },
      user: { _id: "12345" }, 
    });
    res = mockResponse();
  });

  it("Powinno zwrócić 400 jeśli użytkownik nie istnieje", async () => {
    User.findById.mockResolvedValue(null);

    await getCodeByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Nie znaleziono użytkownika!",
    });
  });

  it("Powinno zwrócić 400 jeśli kod jest nieprawidłowy", async () => {
    User.findById.mockResolvedValue({ _id: "12345", balance: 0 });
    Giftcard.findOne.mockResolvedValueOnce(null);

    await getCodeByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ten kod jest niepoprawny!",
    });
  });

  it("Powinno zwrócić 400 jeśli kod został już wykorzystany", async () => {
    User.findById.mockResolvedValue({ _id: "12345", balance: 0 });
    Giftcard.findOne
      .mockResolvedValueOnce({ code: "VALIDCODE123", used: true })
      .mockResolvedValueOnce(null);

    await getCodeByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Ten kod został już wykorzystany!",
    });
  });

  it("Powinno zwrócić 400 jeśli kod wygasł", async () => {
    User.findById.mockResolvedValue({ _id: "12345", balance: 0 });
    Giftcard.findOne.mockResolvedValue({
      code: "VALIDCODE123",
      expiresAt: new Date(Date.now() - 86400000), // Kod wygasł wczoraj
      used: false,
      usedBy: null,
    });

    await getCodeByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Wykorzystałeś już kod podarunkowy!",
    });
  });

  it("Powinno zwrócić zaktualizowany giftcard i saldo użytkownika", async () => {
    const mockGiftcard = {
      code: "VALIDCODE123",
      expiresAt: new Date(Date.now() + 86400000), // Kod ważny do jutra
      used: false,
      balance: 50,
      save: jest.fn(),
    };

    const mockUser = {
      _id: "12345",
      balance: 0,
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(mockUser);
    Giftcard.findOne
      .mockResolvedValueOnce(mockGiftcard) // Giftcard z kodem
      .mockResolvedValueOnce(null); // Brak kodów użytych przez użytkownika

    await getCodeByName(req, res);

    expect(mockGiftcard.used).toBe(true);
    expect(mockGiftcard.usedBy).toBe(mockUser._id);
    expect(mockUser.balance).toBe(50);
    expect(mockGiftcard.save).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockGiftcard);
  });
});
