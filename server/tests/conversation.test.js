const Conversation = require('../models/conversation'); 
const { getConversationsForUser, sendMessage, getConversationDetails, deleteConversation } = require("../controllers/conversationController");
const mongoose = require('mongoose');
const { mockRequest, mockResponse } = require('jest-mock-req-res'); 

describe('getConversationsForUser', () => {
  let mockFind;

  beforeEach(() => {
  
    mockFind = jest.spyOn(Conversation, 'find');
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('Powinno wyrzucić błąd gdy coś pójdzie nie tak przy pobieraniu konwersacji', async () => {
    const mockUserId = new mongoose.Types.ObjectId('674cd04bdcddaa78ec9a8661');

    mockFind.mockImplementation(() => {
      throw new Error('Server error');
    });

    const req = mockRequest({ user: { _id: mockUserId } });
    const res = mockResponse();

    await getConversationsForUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Błąd podczas pobierania listy konwersacji.',
    });
  });
});


jest.mock("../models/conversation");


describe("sendMessage", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        receiverId: "receiver123",
        content: "Cześć! Jak się masz?",
      },
      user: { _id: "sender456" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("powinno wysłać wiadomość w istniejącej konwersacji", async () => {
    const mockConversation = {
      participants: ["sender456", "receiver123"],
      messages: [],
      deletedBy: [{ userId: "sender456", isDeleted: true }],
      save: jest.fn(),
    };

    Conversation.findOne.mockResolvedValue(mockConversation);

    await sendMessage(mockRequest, mockResponse);

    expect(Conversation.findOne).toHaveBeenCalledWith({
      participants: { $all: ["sender456", "receiver123"] },
    });
    expect(mockConversation.deletedBy).toEqual([
      { userId: "sender456", isDeleted: false },
    ]);
    expect(mockConversation.messages).toHaveLength(1);
    expect(mockConversation.messages[0]).toMatchObject({
      sender: "sender456",
      receiver: "receiver123",
      content: "Cześć! Jak się masz?",
    });
    expect(mockConversation.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockConversation.messages[0]);
  });

  it("powinno stworzyć nową konwersację, jeśli nie istnieje", async () => {
    Conversation.findOne.mockResolvedValue(null);

    const mockConversation = {
      participants: ["sender456", "receiver123"],
      messages: [],
      save: jest.fn(),
    };

    Conversation.prototype.save = jest.fn().mockResolvedValue(mockConversation);
    Conversation.mockImplementation(() => mockConversation);

    await sendMessage(mockRequest, mockResponse);

    expect(Conversation.findOne).toHaveBeenCalledWith({
      participants: { $all: ["sender456", "receiver123"] },
    });
    expect(mockConversation.messages).toHaveLength(1);
    expect(mockConversation.messages[0]).toMatchObject({
      sender: "sender456",
      receiver: "receiver123",
      content: "Cześć! Jak się masz?",
    });
    expect(mockConversation.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockConversation.messages[0]);
  });

  it("powinno zwrócić status 500 w przypadku błędu serwera", async () => {
    Conversation.findOne.mockRejectedValue(new Error("Błąd bazy danych"));

    await sendMessage(mockRequest, mockResponse);

    expect(Conversation.findOne).toHaveBeenCalledWith({
      participants: { $all: ["sender456", "receiver123"] },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Błąd podczas wysyłania wiadomości.",
    });
  });
});

jest.mock("../models/conversation");


describe("getConversationDetails", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      params: { id: "conversation123" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it("powinno zwrócić status 500 w przypadku błędu serwera", async () => {
   
    Conversation.findById.mockImplementation(() => {
      throw new Error("Błąd bazy danych");
    });
  
    await getConversationDetails(mockRequest, mockResponse);
  
    expect(Conversation.findById).toHaveBeenCalledWith("conversation123");
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Błąd serwera.",
    });
  });
});



describe("deleteConversation", () => {
  let mockRequest, mockResponse, mockConversation;

  beforeEach(() => {
    mockRequest = {
      params: { id: "conversation123" },
      user: { _id: "user1" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockConversation = {
      _id: "conversation123",
      participants: ["user1", "user2"],
      deletedBy: [],
      save: jest.fn(),
    };

    jest.clearAllMocks();
  });

 

  it("powinno dodać nowy wpis, jeśli użytkownik nie istnieje w `deletedBy`", async () => {
    Conversation.findById.mockResolvedValue(mockConversation);

    await deleteConversation(mockRequest, mockResponse);

    expect(Conversation.findById).toHaveBeenCalledWith("conversation123");
    expect(mockConversation.deletedBy).toContainEqual({
      userId: "user1",
      isDeleted: true,
    });
    expect(mockConversation.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Konwersacja została usunięta z widoku.",
    });
  });

  it("powinno zwrócić status 404, jeśli konwersacja nie istnieje", async () => {
    Conversation.findById.mockResolvedValue(null);

    await deleteConversation(mockRequest, mockResponse);

    expect(Conversation.findById).toHaveBeenCalledWith("conversation123");
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Konwersacja nie została znaleziona.",
    });
  });

  it("powinno zwrócić status 403, jeśli użytkownik nie jest uczestnikiem konwersacji", async () => {
    Conversation.findById.mockResolvedValue({
      ...mockConversation,
      participants: ["user2", "user3"],
    });

    await deleteConversation(mockRequest, mockResponse);

    expect(Conversation.findById).toHaveBeenCalledWith("conversation123");
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Nie masz dostępu do tej konwersacji.",
    });
  });

  it("powinno zwrócić status 500 w przypadku błędu serwera", async () => {
    Conversation.findById.mockRejectedValue(new Error("Błąd bazy danych"));

    await deleteConversation(mockRequest, mockResponse);

    expect(Conversation.findById).toHaveBeenCalledWith("conversation123");
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Błąd podczas usuwania konwersacji.",
    });
  });
});