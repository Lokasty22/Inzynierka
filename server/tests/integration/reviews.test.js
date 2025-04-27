const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const {Listing} = require('../../models/listing');
const { User } = require("../../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;
let user;
let mockUser;
let testListingsIds = [];
require("dotenv").config();

jest.mock('../../middleware/tokenVerification', () => {
  return (req,res, next) => {
    req.user = mockUser;
    next();
  };
});


describe("GET /api/reviews", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoose.connect(uri);
    user = new User({
      firstName: 'Kamil',
      lastName: 'Nowak',
      role: 'Uczeń',
      phoneNumber: '123123123',
      email: 'testtest12@gmail.com',
      password: 'Test1hasl!',
    });

    await user.save();

    user.generateAuthToken = jest.spyOn(User.prototype, 'generateAuthToken').mockResolvedValue('token');
    token = user.generateAuthToken();
    mockUser = {_id: user._id.toString(), role: 'Nauczyciel'};
    
    const newReview = new Listing({
      teacher: user._id,
      subject: "Matematyka",
      title: "Test ogłoszenia",
      description: "Opis ogłoszenia",
      pricePerHour: 22,
      mode: "Online",
      state: "Lubelskie",
      city: "Lublin",
      reviews: [],
    });

    await newReview.save();

    mockUser = {_id: user.id.toString(), role: 'Uczeń'};

    newReview.reviews.push({
      student: user._id,
      comment: "Test komentarza do ogłoszenia",
      rating: 4,
    });
    await testListingsIds.push(newReview._id);

  });

  afterAll(async () => {
    await Listing.deleteMany({_id: {$in: testListingsIds}});
    await User.findByIdAndDelete(user._id);
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it("Pobierz ostatnie recenzje", async () => {
    const res = await request(app).get(`/api/reviews`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
