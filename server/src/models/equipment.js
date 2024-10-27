const mongoose = require('mongoose');

const {
    EQUIPMENT_STATUSES,
} = require('./constants');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Price per unit
    totalPrice: { type: Number, required: true }, // Total cost = quantity * price
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Equipment', equipmentSchema);