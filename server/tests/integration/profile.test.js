const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
const { MongoMemoryServer } = require('mongodb-memory-server');

require("dotenv").config();
let token;
let mockUser;
let testListingIds = []; // Tablica do śledzenia testowych ogłoszeń
let mongoServer;
// Mockowanie weryfikacji tokenu

jest.mock('../../middleware/tokenVerification', () => {
    return (req,res,next) => {
    req.user = mockUser;
    next();
    };
});

describe('GET /api/users',() => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);      
        let newUser = new User({
            firstName: "Jan",
            lastName: "Kowalski",
            role: "Uczeń",
            phoneNumber: "123123123",
            email: "student@gmail.com",
            password: "Student!123",
        });
    
        await newUser.save();
        
        newUser.generateAuthToken = jest.spyOn(User.prototype, 'generateAuthToken').mockResolvedValue('token');
        token = newUser.generateAuthToken()
    
        mockUser = {_id: newUser._id.toString(), role: newUser.role};
        testListingIds.push(mockUser._id);
    });
    
    afterAll(async () => {
        await User.deleteMany({_id: {$in: testListingIds}});      
        await mongoose.disconnect;
        await mongoServer.stop();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    


    it('powinien pobrać profil użytkownika' , async () =>{
        const res = await request(app).get(`/api/users/me`)
        .set('Authorization', `Bearer:${token}`);
        expect(res.status).toBe(200);
    });
});