const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../index");
const { Newsletter } = require("../../models/newsletter");
const { MongoMemoryServer } = require("mongodb-memory-server");

require("dotenv").config();
let mongoServer;
let testEmail;

describe("Newsletter", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    await mongoose.connect(uri);
    testEmail = `test_${Date.now()}@gmail.com`;
  });

  afterAll(async () => {
    await Newsletter.deleteOne({ email: testEmail });
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  it("powinno pomyślnie zasubskrybować", async () => {
    const res = await request(app).post(`/api/newsletter/subscribe`).send({
      subscribtionEmail: testEmail,
    });
    console.log(res.body);
    expect(res.status).toBe(201);
  });

  it("nie powinno pomyślnie zabsubskrybować", async () => {
    const res = await request(app).post(`/api/newsletter/subscribe`).send({
      subscribtionEmail: "123",
    });
    expect(res.body.message).toBe("Adres email jest niepoprawny!");
    expect(res.status).toBe(400);
  });
});
