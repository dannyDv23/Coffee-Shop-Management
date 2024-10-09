const mongoose = require('mongoose');

const {
    ORDER_STATUSES,
} = require('./constants');

const orderSchema = new mongoose.Schema({
    product: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
        numberProduct: { type: Number, required: true } // Quantity of the product
    }],
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true }, // Reference to the table
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales', required: false },
    price: { type: Number, required: true }, // Total price, with or without sale
    time: { type: String, required: true }, // Order time
    status: { type: String, enum: ORDER_STATUSES, required: true } // Order status
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order