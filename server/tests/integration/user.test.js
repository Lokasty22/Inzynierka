const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const { User } = require("../../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
let req;
let mockUser;
let mongoServer;
let generateEmail;
let token;
let user;

require("dotenv").config();
jest.mock("../../middleware/tokenVerification", () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

describe("Użytkownicy (users)", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    mongoose.connect(uri);
    generateEmail = `test_${Date.now()}@gmail.com`;

    req = {
      firstName: "Kamil",
      lastName: "Nowak",
      email: generateEmail,
      phoneNumber: "123123123",
      role: "Nauczyciel",
      password: "Test1ehaslo!",
    };

    user = new User({
      firstName: "Adam",
      lastName: "Nowak",
      email: "test@gmail.com",
      phoneNumber: "123123123",
      role: "Uczeń",
      password: "Testtest1!.",
    });

    await user.save();

    user.generateAuthToken = jest.spyOn(User.prototype,'generateAuthToken').mockResolvedValue('token');
    token = await user.generateAuthToken();
    mockUser = {_id: user._id, role: "Uczeń"};

  });

  afterAll(async () => {
    await User.findByIdAndDelete(user._id);
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
  
  describe("POST /api/users", () => {
    it("powinien się zarejestrować", async () => {
      const res = await request(app).post(`/api/users/`).send({
        ...req,
      });
      expect(res.status).toBe(201);
    });

    it("powinien się zalogować", async () => {
      const res = await request(app).post(`/api/auth`).send({
        email: generateEmail,
        password: "Test1ehaslo!",
      });
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/users", () => {

    it("powinien pobrać profil użytkownika", async () => {
      const res = await request(app)
        .get(`/api/users/me`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("powinien pobrać porifl użytkownika po id", async () => {
      const res = await request(app).get(`/api/users/${user._id}`);

      expect(res.body.firstName).toBe("Adam");
      expect(res.body.lastName).toBe("Nowak");
      expect(res.status).toBe(200);
    });
    it("powinien pobrać wiadomości użytkownika po jego id", async () => {
      const res = await request(app)
        .get(`/api/conversations/`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/users", () => {

    it("powinien usunac uzytkownika", async () => {
      const res = await request(app)
        .delete(`/api/users/me`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
