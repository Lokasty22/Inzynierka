const { addListing, getListings, getListingById, promoteListing, addReview, editReview } = require('../controllers/listingController');
const { Listing, validateListing } = require('../models/listing');
const { User } = require('../models/user');


describe('addListing', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { _id: 'mockUserId' },
            body: {
                subject: 'Matematyka',
                title: 'Korepetycje z matematyki',
                description: 'Pomogę w przygotowaniu do matury z matematyki.',
                pricePerHour: 50,
                mode: 'Online',
                address: '',
                state: 'Mazowieckie',
                city: 'Warszawa',
                availability: [
                    {
                        day: 'Poniedziałek',
                        times: ['10:00', '14:00']
                    }
                ],
                teachingScope: 'Podstawówka',
                experience: '5 lat nauczania w szkole',
                education: 'Magister matematyki',
                isPromoted: false,
                promotionEndDat: null,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        Listing.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ ...req.body, teacher: req.user._id }),
        }));

        validateListing.mockImplementation(() => ({ error: null }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('powinno zwrócić status 201 i zapisany obiekt ogłoszenia przy poprawnych danych', async () => {
        await addListing(req, res);

        expect(validateListing).toHaveBeenCalledWith(req.body);
        expect(Listing).toHaveBeenCalledWith({
            teacher: req.user._id,
            ...req.body,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ ...req.body, teacher: req.user._id });
    });

    it('powinno zwrócić status 400, jeśli dane wejściowe są niepoprawne', async () => {
        validateListing.mockImplementation(() => ({
            error: { details: [{ message: 'Invalid input' }] },
        }));

        await addListing(req, res);

        expect(validateListing).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error: 'Invalid input' });
    });

    it('powinno zwrócić status 500, jeśli zapis w bazie się nie powiedzie', async () => {
        Listing.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Database error')),
        }));

        await addListing(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Nie udało się dodać ogłoszenia',
            details: 'Database error',
        });
    });
});


describe('getListings', () => {
    let mockRequest, mockResponse, mockFind;

    beforeEach(() => {
        mockRequest = {
            query: {}, // Domyślnie brak filtrów
        };

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        mockFind = jest.spyOn(Listing, 'find');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('powinno zwrócić wszystkie ogłoszenia, jeśli brak filtrów', async () => {
        const listings = [
            { title: 'Lekcja matematyki', subject: 'Matematyka' },
            { title: 'Lekcja angielskiego', subject: 'Angielski' },
        ];
        mockFind.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(listings),
            }),
        });

        await getListings(mockRequest, mockResponse);

        expect(mockFind).toHaveBeenCalledWith({});
        expect(mockResponse.json).toHaveBeenCalledWith(listings);
    });

    it('powinno filtrować ogłoszenia na podstawie parametrów', async () => {
        mockRequest.query = { subject: 'Matematyka', city: 'Warszawa' };

        const listings = [{ title: 'Lekcja matematyki', subject: 'Matematyka', city: 'Warszawa' }];
        mockFind.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(listings),
            }),
        });

        await getListings(mockRequest, mockResponse);

        expect(mockFind).toHaveBeenCalledWith({ subject: 'Matematyka', city: 'Warszawa' });
        expect(mockResponse.json).toHaveBeenCalledWith(listings);
    });

    it('powinno zwrócić status 500 w przypadku błędu', async () => {
        mockFind.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            }),
        });

        await getListings(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
});

describe('getListingById', () => {
    let mockRequest, mockResponse, mockFindById;

    beforeEach(() => {
        mockRequest = {
            params: { id: 'listingId123' },
        };

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        mockFindById = jest.spyOn(Listing, 'findById');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('powinno zwrócić ogłoszenie, jeśli istnieje', async () => {
        const listing = {
            _id: 'listingId123',
            title: 'Lekcja matematyki',
            teacher: { firstName: 'Jan', lastName: 'Kowalski', profilePicture: 'urlDoZdjęcia' },
            reviews: [
                {
                    student: { firstName: 'Anna', lastName: 'Nowak', profilePicture: 'urlDoZdjęcia', state: 'Mazowieckie', city: 'Warszawa' },
                    comment: 'Świetna lekcja!',
                    rating: 5,
                },
            ],
        };

        mockFindById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(listing),
                }),
            }),
        });

        await getListingById(mockRequest, mockResponse);

        expect(mockFindById).toHaveBeenCalledWith('listingId123');
        expect(mockResponse.json).toHaveBeenCalledWith(listing);
    });

    it('powinno zwrócić status 404, jeśli ogłoszenie nie istnieje', async () => {
        mockFindById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            }),
        });

        await getListingById(mockRequest, mockResponse);

        expect(mockFindById).toHaveBeenCalledWith('listingId123');
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Ogłoszenie nie znalezione' });
    });

    it('powinno zwrócić status 500 w przypadku błędu', async () => {
        mockFindById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockRejectedValue(new Error('Database error')),
                }),
            }),
        });

        await getListingById(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
});


jest.mock('../models/listing');
jest.mock('../models/user');

describe('promoteListing', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('powinno promować ogłoszenie i zwrócić status 200', async () => {
        const mockRequest = {
            params: { listingId: 'listing123' },
            body: { days: 7, price: 50, userId: 'user123' }
        };

        const mockListing = {
            _id: 'listing123',
            isPromoted: false,
            promotionEndDate: null,
            save: jest.fn().mockResolvedValue()
        };

        const mockUser = {
            _id: 'user123',
            balance: 100,
            save: jest.fn().mockResolvedValue()
        };

        Listing.findById.mockResolvedValue(mockListing);
        User.findById.mockResolvedValue(mockUser);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await promoteListing(mockRequest, mockResponse);

        expect(Listing.findById).toHaveBeenCalledWith('listing123');
        expect(User.findById).toHaveBeenCalledWith('user123');
        expect(mockUser.balance).toBe(50); // saldo powinno być pomniejszone o cenę promocji
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockListing.isPromoted).toBe(true);
        expect(mockListing.promotionEndDate).toBeInstanceOf(Date); // data promocji powinna być ustawiona
        expect(mockListing.save).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Ogłoszenie zostało pomyślnie promowane."
        });
    });

    test('powinno zwrócić status 400, jeśli brakuje danych wejściowych', async () => {
        const mockRequest = {
            params: { listingId: 'listing123' },
            body: { days: null, price: null, userId: 'user123' }
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await promoteListing(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Brak wymaganych danych (days lub price)."
        });
    });

    test('powinno zwrócić status 404, jeśli ogłoszenie nie istnieje', async () => {
        const mockRequest = {
            params: { listingId: 'listing123' },
            body: { days: 7, price: 50, userId: 'user123' }
        };

        Listing.findById.mockResolvedValue(null);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await promoteListing(mockRequest, mockResponse);

        expect(Listing.findById).toHaveBeenCalledWith('listing123');
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Ogłoszenie nie zostało znalezione."
        });
    });

    test('powinno zwrócić status 400, jeśli użytkownik ma niewystarczające saldo', async () => {
        const mockRequest = {
            params: { listingId: 'listing123' },
            body: { days: 7, price: 50, userId: 'user123' }
        };

        const mockListing = { _id: 'listing123' };
        const mockUser = { _id: 'user123', balance: 20, save: jest.fn() };

        Listing.findById.mockResolvedValue(mockListing);
        User.findById.mockResolvedValue(mockUser);

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await promoteListing(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('user123');
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Niewystarczające saldo, aby opłacić promocję."
        });
    });

    test('powinno zwrócić status 500 w przypadku błędu serwera', async () => {
        const mockRequest = {
            params: { listingId: 'listing123' },
            body: { days: 7, price: 50, userId: 'user123' }
        };

        Listing.findById.mockRejectedValue(new Error('Błąd serwera'));

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await promoteListing(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Wystąpił błąd podczas promowania ogłoszenia."
        });
    });
});



jest.mock('../models/listing');


describe('addReview', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {
            params: { listingId: '12345' },
            body: { comment: 'Świetne ogłoszenie!', rating: 5 },
            user: { _id: '67890' }, 
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });


    it('powinno zwrócić status 500 w przypadku błędu serwera', async () => {
        Listing.findById = jest.fn().mockRejectedValue(new Error('Błąd serwera'));

        await addReview(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Błąd serwera' });
    });
});


