const mongoose = require('mongoose');
const {
    BOOKING_STATUSES,
} = require('./constants');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: null },
    status: { type: String, enum: BOOKING_STATUSES, required: true },
    tableId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true }]
});

module.exports = mongoose.model('Booking', bookingSchema);
