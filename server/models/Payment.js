const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['W toku', 'Zatwierdzony', 'Odrzucony'],
    default: 'W toku',
  },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
