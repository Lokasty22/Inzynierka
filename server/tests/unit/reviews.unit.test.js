const { getLatestReviews } = require('../../controllers/reviewController');
const { Listing } = require('../../models/listing');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

jest.mock('../../models/listing');

describe('Recenzje (reviews) - testy jednostkowe', () => {
  
  describe('GET /api/reviews', () => {
    let req, res, next;

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/reviews',
      });
      res = httpMocks.createResponse();
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('powinien zwrócić status 200 i tablicę recenzji', async () => {
      const mockListings = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Test Listing 1",
          teacher: {
            firstName: "Jan",
            lastName: "Kowalski",
            profilePicture: "jan.jpg",
          },
          reviews: [
            {
              _id: new mongoose.Types.ObjectId(),
              student: {
                firstName: "Anna",
                lastName: "Nowak",
                profilePicture: "anna.jpg",
              },
              comment: "Świetny nauczyciel!",
              rating: 5,
              createdAt: new Date('2024-01-01T10:00:00Z'),
            },
            {
              _id: new mongoose.Types.ObjectId(),
              student: {
                firstName: "Piotr",
                lastName: "Zieliński",
                profilePicture: "piotr.jpg",
              },
              comment: "Bardzo pomocny.",
              rating: 4,
              createdAt: new Date('2024-01-02T12:00:00Z'),
            },
          ],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Test Listing 2",
          teacher: {
            firstName: "Maria",
            lastName: "Wiśniewska",
            profilePicture: "maria.jpg",
          },
          reviews: [
            {
              _id: new mongoose.Types.ObjectId(),
              student: {
                firstName: "Krzysztof",
                lastName: "Lewandowski",
                profilePicture: "krzysztof.jpg",
              },
              comment: "Dobrze przygotowany materiał.",
              rating: 4,
              createdAt: new Date('2024-01-03T14:00:00Z'),
            },
          ],
        },
      ];

      Listing.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockListings),
      });

      // Wywołanie funkcji kontrolera
      await getLatestReviews(req, res, next);

      // Sprawdzenie, czy Listing.find() został wywołany poprawnie
      expect(Listing.find).toHaveBeenCalledWith({ 'reviews.0': { $exists: true } });

      // Sprawdzenie statusu odpowiedzi
      expect(res.statusCode).toBe(200);

      // Sprawdzenie, czy odpowiedź zawiera tablicę recenzji
      const data = res._getJSONData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3); // 2 recenzje z pierwszego ogłoszenia i 1 z drugiego

      // Sprawdzenie zawartości recenzji
      expect(data[0]).toHaveProperty('reviewId');
      expect(data[0]).toHaveProperty('comment', 'Dobrze przygotowany materiał.');
      expect(data[0]).toHaveProperty('rating', 4);
      expect(data[0]).toHaveProperty('student');
      expect(data[0].student).toHaveProperty('firstName', 'Krzysztof');
      expect(data[0].student).toHaveProperty('lastName', 'Lewandowski');
      expect(data[0].student).toHaveProperty('profilePicture', 'krzysztof.jpg');
      expect(data[0]).toHaveProperty('teacher');
      expect(data[0].teacher).toHaveProperty('firstName', 'Maria');
      expect(data[0].teacher).toHaveProperty('lastName', 'Wiśniewska');
      expect(data[0].teacher).toHaveProperty('profilePicture', 'maria.jpg');
      expect(data[0]).toHaveProperty('listingId');
      expect(data[0]).toHaveProperty('listingTitle', 'Test Listing 2');

      expect(data[1]).toHaveProperty('comment', 'Bardzo pomocny.');
      expect(data[1]).toHaveProperty('rating', 4);
      expect(data[1].student).toHaveProperty('firstName', 'Piotr');

      expect(data[2]).toHaveProperty('comment', 'Świetny nauczyciel!');
      expect(data[2]).toHaveProperty('rating', 5);
      expect(data[2].student).toHaveProperty('firstName', 'Anna');
      expect(data[2].teacher).toHaveProperty('firstName', 'Jan');
      expect(data[2]).toHaveProperty('listingTitle', 'Test Listing 1');
    });

    it('powinien zwrócić status 500 w przypadku błędu', async () => {
      Listing.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database Error')),
      });

      await getLatestReviews(req, res, next);

      // Sprawdzenie, czy Listing.find() został wywołany poprawnie
      expect(Listing.find).toHaveBeenCalledWith({ 'reviews.0': { $exists: true } });

      // Sprawdzenie statusu odpowiedzi
      expect(res.statusCode).toBe(500);

      // Sprawdzenie treści odpowiedzi
      const data = res._getJSONData();
      expect(data).toHaveProperty('message', 'Błąd serwera');
    });
  });

});
