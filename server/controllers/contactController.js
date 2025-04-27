const AdminMessage = require('../models/adminMessage');

exports.submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new AdminMessage({
            name,
            email,
            subject,
            message,
        });

        await newMessage.save();
        res.status(201).send({ message: 'Wiadomość została wysłana pomyślnie' });
    } catch (error) {
        console.error('Błąd podczas wysyłania wiadomości:', error);
        res.status(500).send({ message: 'Błąd serwera' });
    }
};
