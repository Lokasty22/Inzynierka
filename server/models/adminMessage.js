
const mongoose = require('mongoose');

const adminMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const AdminMessage = mongoose.model('AdminMessage', adminMessageSchema);

module.exports = AdminMessage;
