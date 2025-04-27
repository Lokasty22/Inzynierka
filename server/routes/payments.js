const express = require('express');
const router = express.Router();
const tokenVerification = require('../middleware/tokenVerification');
const Payment = require('../models/Payment');
const { User } = require('../models/user');

router.post('/', tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, amount } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'Użytkownik nie znaleziony' });
    }

    if (amount > user.balance) {
      return res.status(400).send({
        message: 'Nie możesz wypłacić więcej niż masz na saldzie',
      });
    }

    const payment = new Payment({
      user: userId,
      email,
      amount,
    });

    await payment.save();

    res.status(201).send({
      message: 'Żądanie wypłaty zostało wysłane do administratora',
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia żądania wypłaty:', error);
    res.status(500).send({ message: 'Błąd serwera' });
  }
});

router.get('/history', tokenVerification, async (req, res) => {
    try {
      const payments = await Payment.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      res.json(payments);
    } catch (error) {
      console.error('Błąd podczas pobierania historii wypłat:', error);
      res.status(500).send('Błąd serwera');
    }
  });
  
module.exports = router;
