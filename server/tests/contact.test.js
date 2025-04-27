const AdminMessage = require('../models/adminMessage');
const { submitMessage } = require('../controllers/contactController');


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body) => ({
    body,
});

jest.mock('../models/adminMessage');

describe('contactController - wysyłanie wiadomości ', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); 
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    test('powinno zapisać wiadomość i zwrócić 201', async () => {
        const req = mockRequest({
            name: 'Jan Kowalski',
            email: 'jan.kowalski@example.com',
            subject: 'Testowa wiadomość',
            message: 'To jest treść testowej wiadomości.',
        });
        const res = mockResponse();

        AdminMessage.prototype.save = jest.fn().mockResolvedValue();

        await submitMessage(req, res);

        expect(AdminMessage).toHaveBeenCalled();
        expect(AdminMessage.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Wiadomość została wysłana pomyślnie',
        });
    });

    test('powinno zwrócić 500 w przypadku błędu serwera', async () => {
        const req = mockRequest({
            name: 'Jan Kowalski',
            email: 'jan.kowalski@example.com',
            subject: 'Testowa wiadomość',
            message: 'To jest treść wiadomości.',
        });
        const res = mockResponse();

        AdminMessage.prototype.save = jest.fn().mockRejectedValue(new Error('Błąd zapisu'));

        await submitMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Błąd serwera',
        });
    });
});
