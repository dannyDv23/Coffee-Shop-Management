const Product = require("../models/product");

const getAllProduct = async () => {
  return await Product.find({status: 'Available'});
};


module.exports = {
    getAllProduct
};
