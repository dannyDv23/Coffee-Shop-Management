const mongoose = require('mongoose');

const {
    MATERIAL_STATUSES,
} = require('./constants');

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    status: { type: String, enum: MATERIAL_STATUSES, required: true }
});

module.exports = mongoose.model('Material', materialSchema);
