const mongoose = require('mongoose');

const {
    MATERIAL_STATUSES,
    HISTORY_MATERIAL_STATUSES,
} = require('./constants');

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true },
    totalQuantity: { type: Number, required: true }, // after update remainingQuantity => totalQuantity = remainingQuantity + newQuantity
    status: { type: String, enum: MATERIAL_STATUSES, required: false },
    history: [{
            datePurchase: { type: Date, required: true },
            dateShipment: { type: Date, required: true },
            newQuantity: { type: Number, required: true },
            remainingQuantity: { type: Number, required: true },// old material in totalQuantity
            price: { type: Number, required: true },
            status: { type: String, enum: HISTORY_MATERIAL_STATUSES, required: true }
    }]
    
});

module.exports = mongoose.model('Material', materialSchema);