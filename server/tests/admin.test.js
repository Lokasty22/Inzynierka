const mongoose = require('mongoose');
const adminController = require('../controllers/adminController');
const { User } = require('../models/user');
const { Listing } = require('../models/listing');
const Reservation = require('../models/reservation');
const AdminMessage = require('../models/adminMessage');
const Article = require('../models/article');

jest.mock('../models/user');
jest.mock('../models/listing');
jest.mock('../models/reservation');
jest.mock('../models/adminMessage');
jest.mock('../models/article');

describe('Kontroler Administratora', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('powinien zwrócić listę użytkowników bez haseł', async () => {
      const req = { query: {} };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockUsers = [
        { _id: '1', firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com' },
        { _id: '2', firstName: 'Anna', lastName: 'Nowak', email: 'anna@example.com' }
      ];

      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      await adminController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({});
      expect(res.send).toHaveBeenCalledWith(mockUsers);
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { query: {} };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Błąd bazy danych')),
        }),
      });

      await adminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('getUserById', () => {
    it('powinien zwrócić użytkownika po ID bez hasła', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockUser = { _id: '1', firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com' };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await adminController.getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith(mockUser);
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await adminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono użytkownika' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Błąd bazy danych')),
      });

      await adminController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('updateUser', () => {
    it('powinien zaktualizować dane użytkownika', async () => {
      const req = {
        params: { id: '1' },
        body: { firstName: 'Janek', password: 'nowehaslo' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const updatedUser = { _id: '1', firstName: 'Janek', lastName: 'Kowalski', email: 'jan@example.com' };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser),
      });

      await adminController.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('1', { firstName: 'Janek' }, { new: true });
      expect(res.send).toHaveBeenCalledWith(updatedUser);
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      const req = {
        params: { id: '1' },
        body: { firstName: 'Janek' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await adminController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono użytkownika' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = {
        params: { id: '1' },
        body: { firstName: 'Janek' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Błąd bazy danych')),
      });

      await adminController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('deleteUser', () => {
    it('powinien usunąć użytkownika', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      await adminController.deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith({ message: 'Użytkownik został pomyślnie usunięty' });
    });

    it('powinien zwrócić 404, jeśli użytkownik nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findByIdAndDelete.mockResolvedValue(null);

      await adminController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono użytkownika' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findByIdAndDelete.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('getAllListings', () => {
    it('powinien zwrócić listę ogłoszeń', async () => {
      const req = { query: {} };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockListings = [
        { _id: '1', title: 'Matematyka', subject: 'Matematyka', teacher: '1' },
        { _id: '2', title: 'Fizyka', subject: 'Fizyka', teacher: '2' },
      ];

      Listing.aggregate.mockResolvedValue(mockListings);

      await adminController.getAllListings(req, res);

      expect(Listing.aggregate).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockListings);
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { query: {} };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.aggregate.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.getAllListings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('getListingById', () => {
    it('powinien zwrócić ogłoszenie po ID', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockListing = { _id: '1', title: 'Matematyka', subject: 'Matematyka', teacher: '1' };

      Listing.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockListing),
      });

      await adminController.getListingById(req, res);

      expect(Listing.findById).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith(mockListing);
    });

    it('powinien zwrócić 404, jeśli ogłoszenie nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await adminController.getListingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono ogłoszenia' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Błąd bazy danych')),
      });

      await adminController.getListingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('updateListing', () => {
    it('powinien zaktualizować ogłoszenie', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Nowa Matematyka' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const updatedListing = { _id: '1', title: 'Nowa Matematyka', subject: 'Matematyka', teacher: '1' };

      Listing.findByIdAndUpdate.mockResolvedValue(updatedListing);

      await adminController.updateListing(req, res);

      expect(Listing.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'Nowa Matematyka' }, { new: true });
      expect(res.send).toHaveBeenCalledWith(updatedListing);
    });

    it('powinien zwrócić 404, jeśli ogłoszenie nie istnieje', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Nowa Matematyka' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findByIdAndUpdate.mockResolvedValue(null);

      await adminController.updateListing(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono ogłoszenia' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = {
        params: { id: '1' },
        body: { title: 'Nowa Matematyka' },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findByIdAndUpdate.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.updateListing(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('deleteListing', () => {
    it('powinien usunąć ogłoszenie', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      await adminController.deleteListing(req, res);

      expect(Listing.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith({ message: 'Ogłoszenie zostało pomyślnie usunięte' });
    });

    it('powinien zwrócić 404, jeśli ogłoszenie nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findByIdAndDelete.mockResolvedValue(null);

      await adminController.deleteListing(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono ogłoszenia' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      Listing.findByIdAndDelete.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.deleteListing(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('getAllMessages', () => {
    it('powinien zwrócić listę wiadomości', async () => {
      const req = {};
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockMessages = [
        { _id: '1', content: 'Wiadomość 1', createdAt: new Date() },
        { _id: '2', content: 'Wiadomość 2', createdAt: new Date() },
      ];

      AdminMessage.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      await adminController.getAllMessages(req, res);

      expect(AdminMessage.find).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockMessages);
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = {};
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Błąd bazy danych')),
      });

      await adminController.getAllMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('getMessageById', () => {
    it('powinien zwrócić wiadomość po ID', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const mockMessage = { _id: '1', content: 'Wiadomość 1' };

      AdminMessage.findById.mockResolvedValue(mockMessage);

      await adminController.getMessageById(req, res);

      expect(AdminMessage.findById).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith(mockMessage);
    });

    it('powinien zwrócić 404, jeśli wiadomość nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.findById.mockResolvedValue(null);

      await adminController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono wiadomości' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.findById.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });

  describe('deleteMessage', () => {
    it('powinien usunąć wiadomość', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      await adminController.deleteMessage(req, res);

      expect(AdminMessage.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith({ message: 'Wiadomość została pomyślnie usunięta' });
    });

    it('powinien zwrócić 404, jeśli wiadomość nie istnieje', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.findByIdAndDelete.mockResolvedValue(null);

      await adminController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Nie znaleziono wiadomości' });
    });

    it('powinien obsłużyć błąd i zwrócić status 500', async () => {
      const req = { params: { id: '1' } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      AdminMessage.findByIdAndDelete.mockRejectedValue(new Error('Błąd bazy danych'));

      await adminController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
  });


});
