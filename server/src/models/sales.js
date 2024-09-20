const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discount: { type: Number, required: true }
});

module.exports = mongoose.model('Sales', salesSchema);
