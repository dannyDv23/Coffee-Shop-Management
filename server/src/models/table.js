const mongoose = require('mongoose');

const {
    TABLE_STATUSES,
} = require('./constants');

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true },
    status: { type: String, enum: TABLE_STATUSES, required: true }
});

const Table  = mongoose.model('Table', tableSchema);
module.exports = Table;
