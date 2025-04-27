const { getUserProfile } = require('../../controllers/userController');
const { User } = require('../../models/user');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

jest.mock('../../models/user');

describe('Profil użytkownika (users) - testy jednostkowe', () => {

    describe('GET /api/users', () => {
        let req, res, next;

        beforeEach(() => {
            // Tworzenie mock request
            req = httpMocks.createRequest({
                method: 'GET',
                url: '/api/users/me',
                user: { _id: new mongoose.Types.ObjectId().toString(), role: 'Uczeń' }
            });

            // Tworzenie mock response
            res = httpMocks.createResponse();
            next = jest.fn();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('powinien zwrócić profil użytkownika z status 200', async () => {
            const mockUser = {
                _id: req.user._id,
                firstName: 'Jan',
                lastName: 'Kowalski',
                email: 'jan@example.com',
                phoneNumber: '123456789',
                role: 'Uczeń',
            };

            User.findById.mockImplementation(() => ({
                select: jest.fn().mockResolvedValue(mockUser)
            }));

            // Wywołanie funkcji kontrolera
            await getUserProfile(req, res, next);

            // Sprawdzenie, czy User.findById został wywołany z prawidłowym ID
            expect(User.findById).toHaveBeenCalledWith(req.user._id);

            // Sprawdzenie statusu odpowiedzi
            expect(res.statusCode).toBe(200);

            // Sprawdzenie zawartości odpowiedzi
            const data = res._getData();
            expect(data).toMatchObject(mockUser);
            expect(data).not.toHaveProperty('password');
        });

        it('powinien zwrócić status 404, jeśli użytkownik nie istnieje', async () => {
            User.findById.mockImplementation(() => ({
                select: jest.fn().mockResolvedValue(null)
            }));

            // Wywołanie funkcji kontrolera
            await getUserProfile(req, res, next);

            // Sprawdzenie, czy User.findById został wywołany z prawidłowym ID
            expect(User.findById).toHaveBeenCalledWith(req.user._id);

            // Sprawdzenie statusu odpowiedzi
            expect(res.statusCode).toBe(404);

            // Sprawdzenie treści odpowiedzi
            const data = res._getData();
            expect(data).toBe('Użytkownik nie znaleziony');
        });

       
    });

});
