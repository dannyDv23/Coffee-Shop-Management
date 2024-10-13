const mongoose = require('mongoose');

const {
    PRODUCT_STATUSES,
} = require('./constants');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: PRODUCT_STATUSES, required: true },
    material: [{
        materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: false },
        quantityUsed: { type: Number, required: false }
    }]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product