const mongoose = require('mongoose');

const {
    HISTORY_MONEY_STATUSES,
} = require('./constants');

const historyMoneySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true }, // Source of collection (order number, etc.)
    money: { type: Number, required: true }, // Amount collected
    status: { type: String, enum: HISTORY_MONEY_STATUSES, required: true }
});

module.exports = mongoose.model('HistoryMoney', historyMoneySchema);