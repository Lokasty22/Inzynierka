require('dotenv').config({ path: '.env.test' });

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../app');

const { User } = require('../../models/user');
const { Listing } = require('../../models/listing');
const Reservation = require('../../models/reservation');

let mockUser;

jest.mock('../../middleware/tokenVerification', () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

jest.mock('../../controllers/userController', () => {
  const originalModule = jest.requireActual('../../controllers/userController');
  
  return {
    __esModule: true,
    ...originalModule,
    updateUserBalance: jest.fn(),
    refundUserBalance: jest.fn(),
    updateTeacherBalance: jest.fn(),
  };
});

const {
  updateUserBalance,
  refundUserBalance,
  updateTeacherBalance,
} = require('../../controllers/userController');

let mongoServer;
let testListingIds = [];
let testReservationIds = [];
let token;
let user;
let listing;

describe('Rezerwacje (Reservations)', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    user = new User({
      firstName: 'Kamil',
      lastName: 'Nowak',
      email: 'test@gmail.com',
      phoneNumber: '123123123',
      role: 'Nauczyciel',
      password: 'Test1ehaslo!',
    });
    await user.save();

    token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWTPRIVATEKEY);

    mockUser = { _id: user._id.toString(), role: user.role };

    listing = new Listing({
      teacher: user._id,
      subject: 'Matematyka',
      title: 'Lekcje matematyki online',
      description: 'Profesjonalne lekcje matematyki dla uczniów szkół średnich.',
      pricePerHour: 50,
      mode: 'Online',
      state: 'Mazowieckie',
      city: 'Warszawa',
      availability: [
        { day: 'Poniedziałek', times: ['10:00', '14:00'] },
        { day: 'Środa', times: ['12:00'] },
      ],
      teachingScope: 'Podstawy matematyki, algebra, geometria',
      experience: '5 lat doświadczenia w nauczaniu matematyki.',
      education: 'Magister matematyki, Certyfikat nauczycielski',
    });
    const savedListing = await listing.save();
    testListingIds.push(savedListing._id);
  });

  afterAll(async () => {
    await Reservation.deleteMany({ _id: { $in: testReservationIds } });
    await Listing.deleteMany({ _id: { $in: testListingIds } });
    await User.findByIdAndDelete(user._id);
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Reservation.deleteMany({});
    testReservationIds = [];
    jest.clearAllMocks();
  });

  describe('POST /api/reservations', () => {
    it('powinno utworzyć nową rezerwację', async () => {
      const reservationData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phone: '987654321',
        comment: 'Proszę o lekcje algebra.',
        lessonType: 'Online',
        selectedDate: '2024-12-15',
        selectedTime: '10:00',
        status: 'Oczekujące na potwierdzenie',
        listingId: listing._id.toString(),
        userId: user._id.toString(),
        lessonCost: 100,
      };

      updateUserBalance.mockResolvedValueOnce(true);

      const res = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.listingId).toBe(reservationData.listingId);
      expect(res.body.userId).toBe(reservationData.userId);

      testReservationIds.push(res.body._id);
    });

    it('powinno zwrócić błąd 500 jeżeli wymagane pola nie są wypełnione', async () => {
      const incompleteData = {
        firstName: 'Jan',
      };

      const res = await request(app)
        .post('/api/reservations')
        .send(incompleteData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });

    it('powinno zwrócić błąd 500 jeżeli brak środków podczas tworzenia rezerwacji', async () => {
      const reservationData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phone: '987654321',
        comment: 'Proszę o lekcje algebra.',
        lessonType: 'Online',
        selectedDate: '2024-12-15',
        selectedTime: '10:00',
        status: 'Oczekujące na potwierdzenie',
        listingId: listing._id.toString(),
        userId: user._id.toString(),
        lessonCost: 100,
      };
    
      updateUserBalance.mockImplementationOnce(() => {
        throw new Error('Brak środków');
      });
    
      const res = await request(app)
        .post('/api/reservations')
        .send(reservationData);
    
      expect(res.body).toHaveProperty('error', 'Brak środków.');
      expect(res.statusCode).toBe(500);
    });
    
  });

  describe('GET /api/reservations', () => {
    beforeEach(async () => {
      const reservations = [
        {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan.kowalski@example.com',
          phone: '987654321',
          comment: 'Proszę o lekcje algebra.',
          lessonType: 'Online',
          selectedDate: '2024-12-15',
          selectedTime: '10:00',
          status: 'Oczekujące na potwierdzenie',
          listingId: listing._id,
          userId: user._id,
          lessonCost: 100,
        },
        {
          firstName: 'Anna',
          lastName: 'Nowak',
          email: 'anna.nowak@example.com',
          phone: '123456789',
          comment: 'Proszę o lekcje geometrii.',
          lessonType: 'Stacjonarnie',
          selectedDate: '2024-12-16',
          selectedTime: '14:00',
          status: 'Potwierdzone',
          listingId: listing._id,
          userId: user._id,
          lessonCost: 150,
        },
      ];

      const insertedReservations = await Reservation.insertMany(reservations);
      insertedReservations.forEach(reservation => testReservationIds.push(reservation._id));
    });

    it('powinno zwrócić wszystkie rezerwacje', async () => {
      const res = await request(app).get('/api/reservations');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body[0]).toHaveProperty('firstName', 'Jan');
      expect(res.body[1]).toHaveProperty('firstName', 'Anna');
    });
  });

  describe('GET /api/reservations/user', () => {
    beforeEach(async () => {
      const reservations = [
        {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan.kowalski@example.com',
          phone: '987654321',
          comment: 'Proszę o lekcje algebra.',
          lessonType: 'Online',
          selectedDate: '2024-12-15',
          selectedTime: '10:00',
          status: 'Oczekujące na potwierdzenie',
          listingId: listing._id,
          userId: user._id,
          lessonCost: 100,
        },
      ];

      const insertedReservations = await Reservation.insertMany(reservations);
      insertedReservations.forEach(reservation => testReservationIds.push(reservation._id));
    });

    it('powinno zwrócić wszystkie rezerwacje danego użytkownika', async () => {
      const res = await request(app)
        .get('/api/reservations/user')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('userId', user._id.toString());
    });

    it('powinno zwrócić błąd 401 jeżeli brak tokenu autoryzacyjnego', async () => {
      const res = await request(app)
        .get('/api/reservations/user');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Brak tokenu autoryzacyjnego');
    });

    it('powinno zwrócić błąd 404 jeżeli brak rezerwacji dla użytkownika', async () => {
      await Reservation.deleteMany({ userId: user._id });

      const res = await request(app)
        .get('/api/reservations/user')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Brak rezerwacji');
    });
  });

  describe('GET /api/reservations/listing/:listingId', () => {
    let listingId;
    let anotherListing;

    beforeEach(async () => {
      anotherListing = new Listing({
        teacher: user._id,
        subject: 'Chemia',
        title: 'Lekcje chemii online',
        description: 'Profesjonalne lekcje chemii dla uczniów szkół średnich.',
        pricePerHour: 60,
        mode: 'Online',
        state: 'Mazowieckie',
        city: 'Warszawa',
      });
      const savedAnotherListing = await anotherListing.save();
      testListingIds.push(savedAnotherListing._id);
      listingId = listing._id;

      const reservations = [
        {
          firstName: 'Jan',
          lastName: 'Kowalski',
          email: 'jan.kowalski@example.com',
          phone: '987654321',
          comment: 'Proszę o lekcje algebra.',
          lessonType: 'Online',
          selectedDate: '2024-12-15',
          selectedTime: '10:00',
          status: 'Oczekujące na potwierdzenie',
          listingId: listingId,
          userId: user._id,
          lessonCost: 100,
        },
        {
          firstName: 'Anna',
          lastName: 'Nowak',
          email: 'anna.nowak@example.com',
          phone: '123456789',
          comment: 'Proszę o lekcje chemii organicznej.',
          lessonType: 'Stacjonarnie',
          selectedDate: '2024-12-20',
          selectedTime: '14:00',
          status: 'Potwierdzone',
          listingId: anotherListing._id,
          userId: user._id,
          lessonCost: 150,
        },
      ];

      const insertedReservations = await Reservation.insertMany(reservations);
      insertedReservations.forEach(reservation => testReservationIds.push(reservation._id));
    });

    it('nie powinno zwrócić rezerwacji dla danego ogłoszenia', async () => {
      const res = await request(app).get(`/api/reservations/listing/${listingId}`);

      expect(res.statusCode).toBe(404);
    });

    it('powinno zwrócić błąd 404 jeżeli brak rezerwacji dla tego ogłoszenia', async () => {
      const fakeListingId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/reservations/listing/${fakeListingId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/reservations/:reservationId', () => {
    let reservationId;

    beforeEach(async () => {
      const reservation = new Reservation({
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phone: '987654321',
        comment: 'Proszę o lekcje chemii organicznej.',
        lessonType: 'Online',
        selectedDate: '2024-12-20',
        selectedTime: '11:00',
        status: 'Oczekujące na potwierdzenie',
        listingId: listing._id,
        userId: user._id,
        lessonCost: 120,
      });
      const savedReservation = await reservation.save();
      reservationId = savedReservation._id;
      testReservationIds.push(reservationId);
    });

    it('powinno zaktualizować status rezerwacji na Potwierdzone', async () => {
      updateTeacherBalance.mockResolvedValueOnce(true);

      const res = await request(app)
        .patch(`/api/reservations/${reservationId}`)
        .set('x-auth-token', token)
        .send({ status: 'Potwierdzone', userId: user._id.toString(), lessonCost: 120 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Status rezerwacji został zaktualizowany.');

      const updatedReservation = await Reservation.findById(reservationId);
      expect(updatedReservation.status).toBe('Potwierdzone');
    });

    it('powinno zaktualizować status rezerwacji na Anulowane i zwrócić środki', async () => {
      refundUserBalance.mockResolvedValueOnce(true);

      const res = await request(app)
        .patch(`/api/reservations/${reservationId}`)
        .send({ status: 'Anulowane', userId: user._id.toString(), lessonCost: 120 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Status rezerwacji został zaktualizowany.');

      const updatedReservation = await Reservation.findById(reservationId);
      expect(updatedReservation.status).toBe('Anulowane');
    });

    it('powinno zwrócić błąd 404 jeżeli rezerwacja nie została znaleziona', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/reservations/${fakeId}`)
        .send({ status: 'Potwierdzone', userId: user._id.toString(), lessonCost: 120 });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Rezerwacja nie została znaleziona.');
    });

  });
});
