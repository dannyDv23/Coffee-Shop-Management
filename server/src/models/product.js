const mongoose = require('mongoose');

const {
    PRODUCT_STATUSES,
} = require('./constants');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: PRODUCT_STATUSES, required: true }
});

module.exports = mongoose.model('Product', productSchema);
