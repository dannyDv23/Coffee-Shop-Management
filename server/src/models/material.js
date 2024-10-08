const mongoose = require('mongoose');

const {
    MATERIAL_STATUSES,
    HISTORY_MATERIAL_STATUSES,
} = require('./constants');

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true }, 
    totalQuantity: { type: Number, required: true }, 
    pricePerUnit: { type: Number, required: true }, 
    status: { type: String, enum: MATERIAL_STATUSES, required: true }, 
    importHistory: [{
        dateImport: { type: String, required: false }, 
        quantity: { type: Number, required: false }, 
        price: { type: Number, required: false }     
    }],
    exportHistory: [{
        dateExport: { type: String, required: false }, 
        quantity: { type: Number, required: false }, 
        price: { type: Number, required: false }     
    }],
});

module.exports = mongoose.model('Material', materialSchema);