const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        default: '',
    },
    lessonType: {
        type: String,
        enum: ['Online', 'Stacjonarnie'],
        required: true,
    },
    selectedDate: { 
        type: String,

    },
    selectedTime: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Oczekujące na potwierdzenie', 'Potwierdzone', 'Anulowane'],
        default: 'Oczekujące na potwierdzenie',
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    lessonCost: { type: Number, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
