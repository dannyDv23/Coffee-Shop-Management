const mongoose = require('mongoose');

const {
    HISTORY_MATERIAL_STATUSES,
} = require('./constants');

const historyMaterialSchema = new mongoose.Schema({
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    batchId: { type: String, required: true },
    datePurchase: { type: Date, required: true },
    dateShipment: { type: Date, required: true },
    quantity: { type: Number, required: true },
    remainingQuantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: HISTORY_MATERIAL_STATUSES, required: true }
});

module.exports = mongoose.model('HistoryMaterial', historyMaterialSchema);
