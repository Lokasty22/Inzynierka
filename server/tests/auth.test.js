const { loginUser } = require('../controllers/authController'); 
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

jest.mock('../models/user'); 
jest.mock('bcrypt'); 

describe('Auth Controller - loginUser', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                email: 'test@example.com',
                password: 'Password123',
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('powinno zwrócić token przy poprawnych danych logowania', async () => {
        const mockUser = {
            _id: '123',
            email: 'test@example.com',
            password: 'hashedPassword',
            generateAuthToken: jest.fn().mockReturnValue('mockToken'),
        };

        User.findOne.mockResolvedValue(mockUser); 
        bcrypt.compare.mockResolvedValue(true); 

        await loginUser(mockReq, mockRes);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockReq.body.email });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockUser.password);
        expect(mockUser.generateAuthToken).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith({
            data: 'mockToken',
            message: 'Logowanie udane',
        });
    });

    it('powinno zwrócić błąd 401, gdy email jest niepoprawny', async () => {
        User.findOne.mockResolvedValue(null); 

        await loginUser(mockReq, mockRes);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockReq.body.email });
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Niepoprawny email lub hasło!' });
    });

    it('powinno zwrócić błąd 401, gdy hasło jest niepoprawne', async () => {
        const mockUser = {
            _id: '123',
            email: 'test@example.com',
            password: 'hashedPassword',
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); 

        await loginUser(mockReq, mockRes);

        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockUser.password);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Niepoprawny email lub hasło!' });
    });

    it('powinno zwrócić błąd 400, gdy dane wejściowe są niepoprawne', async () => {
        mockReq.body = { email: 'invalidEmail', password: '' }; 

        await loginUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
            message: expect.stringContaining('Email'), 
        });
    });

    it('powinno zwrócić błąd 500, gdy wystąpi błąd serwera', async () => {
        User.findOne.mockRejectedValue(new Error('Błąd bazy danych')); 

        await loginUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
});
