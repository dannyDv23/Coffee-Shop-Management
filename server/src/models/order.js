const mongoose = require('mongoose');

const {
    ORDER_STATUSES,
} = require('./constants');

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    numberProduct: { type: Number, required: true },
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales', default: null }, // Foreign Key (Nullable)
    price: { type: Number, required: true }, // Total price, with or without sale
    time: { type: Date, required: true },
    status: { type: String, enum: ORDER_STATUSES, required: true }
});


module.exports = mongoose.model('Order', orderSchema);