const mongoose = require('mongoose');

const {
    TABLE_STATUSES,
} = require('./constants');

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true },
    status: { type: String, enum: TABLE_STATUSES, required: true }
});

module.exports = mongoose.model('Table', tableSchema);
