const mongoose = require('mongoose');

const productMaterialSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    quantityUsed: { type: Number, required: true }
});

module.exports = mongoose.model('ProductMaterial', productMaterialSchema);
