require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const listingsRoutes = require("./routes/listings");
const tokenVerification = require('./middleware/tokenVerification');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const reviewRoutes = require('./routes/review');
const conversationRoutes = require('./routes/conversations');
const giftcardRoutes = require('./routes/giftcard');
const newsletterRoutes = require('./routes/newsletters');
const questionsRoutes = require('./routes/question');
const paymentsRoutes = require('./routes/payments');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/giftcards', giftcardRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/payments', paymentsRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Coś poszło nie tak!');
});

module.exports = app;
