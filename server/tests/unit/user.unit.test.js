const {
  registerUser,
  loginUser,
  getUserProfile,
  getUserProfileById, 
  deleteUser
} = require('../../controllers/userController');
const { User, validate } = require('../../models/user');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mockowanie bibliotek bcrypt i jsonwebtoken
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Użytkownicy (users) - testy jednostkowe', () => {

  // Rejestracja użytkownika
  describe('POST /api/users', () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          firstName: 'Kamil',
          lastName: 'Nowak',
          email: 'test@example.com',
          phoneNumber: '123123123',
          role: 'Nauczyciel',
          password: 'Test1ehaslo!',
        },
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    it('powinien zarejestrować nowego użytkownika i zwrócić token', async () => {
      // Mockowanie znalezienia użytkownika
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      // Mockowanie hashowania hasła
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      // Mockowanie zapisu użytkownika
      const savedUser = new User({ _id: 'userId', ...req.body, password: 'hashedPassword' });
      jest.spyOn(User.prototype, 'save').mockResolvedValue(savedUser);

      // Mockowanie generowania tokenu
      jest.spyOn(User.prototype, 'generateAuthToken').mockReturnValue('token');

      await registerUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('Test1ehaslo!', 'salt');
      expect(User.prototype.save).toHaveBeenCalled();
      expect(User.prototype.generateAuthToken).toHaveBeenCalled();
      expect(res.statusCode).toBe(201);
      const data = res._getData(); 
      expect(data).toHaveProperty('token', 'token');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('firstName', 'Kamil');
      expect(data.user).toHaveProperty('email', 'test@example.com');
    });

    it('powinien zwrócić błąd 400, jeśli użytkownik już istnieje', async () => {
      // Mockowanie znalezienia użytkownika
      const existingUser = new User({ _id: 'existingUserId', email: 'test@example.com' });
      jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

      await registerUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.statusCode).toBe(400);
      const data = res._getData(); 
      expect(data).toBe('Użytkownik z tym adresem email już istnieje.');
    });

  });

  // Logowanie użytkownika
  describe('POST /api/auth', () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/auth',
        body: {
          email: 'test@example.com',
          password: 'Test1ehaslo!',
        },
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    it('powinien zalogować użytkownika i zwrócić token', async () => {
      // Mockowanie znalezienia użytkownika
      const user = new User({ _id: 'userId', email: 'test@example.com', password: 'hashedPassword', role: 'Uczeń' });
      jest.spyOn(User, 'findOne').mockResolvedValue(user);

      // Mockowanie porównania hasła
      bcrypt.compare.mockResolvedValue(true);

      // Mockowanie generowania tokenu
      jest.spyOn(User.prototype, 'generateAuthToken').mockReturnValue('token');

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('Test1ehaslo!', 'hashedPassword');
      expect(User.prototype.generateAuthToken).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      const data = res._getData(); 
      expect(data).toHaveProperty('token', 'token');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('email', 'test@example.com');
    });

    it('powinien zwrócić błąd 400, jeśli użytkownik nie istnieje', async () => {
      // Mockowanie znalezienia użytkownika
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.statusCode).toBe(400);
      const data = res._getData(); 
      expect(data).toBe('Niepoprawny email lub hasło.');
    });

    it('powinien zwrócić błąd 400, jeśli hasło jest nieprawidłowe', async () => {
      // Mockowanie znalezienia użytkownika
      const user = new User({ _id: 'userId', email: 'test@example.com', password: 'hashedPassword', role: 'Uczeń' });
      jest.spyOn(User, 'findOne').mockResolvedValue(user);

      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('Test1ehaslo!', 'hashedPassword');
      expect(res.statusCode).toBe(400);
      const data = res._getData(); 
      expect(data).toBe('Niepoprawny email lub hasło.');
    });

  });

  // Pobieranie profilu użytkownika
  describe('GET /api/users', () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/me',
        user: { _id: 'userId', role: 'Uczeń' },
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    it('powinien zwrócić profil użytkownika', async () => {
      const mockUser = {
        _id: 'userId',
        firstName: 'Adam',
        lastName: 'Nowak',
        email: 'test@example.com',
        phoneNumber: '123123123',
        role: 'Uczeń',
      };
      jest.spyOn(User, 'findById').mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      await getUserProfile(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(200);
      const data = res._getData();
      expect(data).toHaveProperty('firstName', 'Adam');
      expect(data).toHaveProperty('email', 'test@example.com');
      expect(data).not.toHaveProperty('password'); 
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      jest.spyOn(User, 'findById').mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      await getUserProfile(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(404);
      const data = res._getData(); 
      expect(data).toBe('Użytkownik nie znaleziony');
    });

  });

  // Pobieranie użytkownika po ID
  describe('GET /api/users', () => { 
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/userId',
        params: { id: 'userId' },
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    it('powinien zwrócić użytkownika po ID', async () => {
      const mockUser = {
        _id: 'userId',
        firstName: 'Adam',
        lastName: 'Nowak',
        email: 'test@example.com',
        phoneNumber: '123123123',
        role: 'Uczeń',
      };
      jest.spyOn(User, 'findById').mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      await getUserProfileById(req, res, next); 

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(200);
      const data = res._getData(); 
      expect(data).toHaveProperty('firstName', 'Adam');
      expect(data).toHaveProperty('email', 'test@example.com');
      expect(data).not.toHaveProperty('password');
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      jest.spyOn(User, 'findById').mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      await getUserProfileById(req, res, next); 

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(404);
      const data = res._getData(); 
      expect(data).toBe('Użytkownik nie znaleziony');
    });

  });

  // Usuwanie użytkownika
  describe('DELETE /api/users', () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/users/me',
        user: { _id: 'userId', role: 'Uczeń' },
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    it('powinien usunąć użytkownika i zwrócić wiadomość', async () => {
      const mockUser = { _id: 'userId', firstName: 'Adam', email: 'test@example.com' };
      jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(mockUser);

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(200);
      const data = res._getData(); 
      expect(data).toHaveProperty('message', 'Konto zostało usunięte'); 
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(null);

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('userId');
      expect(res.statusCode).toBe(404);
      const data = res._getData(); 
      expect(data).toBe('Użytkownik nie znaleziony');
    });

  });

});
