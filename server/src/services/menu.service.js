const Product = require('../models/product');

    const createProduct = async(data) => {
        const product = new Product(data);
        return product.save();
    }

    const getAllProducts =  async () => {
        return Product.find({status: {$ne: 'Delete'}});
    }

    const getProductById = async (id) => {
        return Product.findById(id).populate('material.materialId');
    }

    const updateProduct =  async (id, data) => {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }

    const deleteProduct = async (id) => {
        return Product.findByIdAndDelete(id);
    }

    module.exports = {
        createProduct,
        getAllProducts,
        getProductById,
        updateProduct,
        deleteProduct,
      };
      
