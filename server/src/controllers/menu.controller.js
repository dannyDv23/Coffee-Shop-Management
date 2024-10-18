const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { productService } = require("../services");
const ApiError = require("../utils/ApiError");


const createNewProduct = catchAsync(async (req, res) => {
    const productBody = {
        name: req.body?.name,
        price: req.body?.price,
        status: 'Available',
        material: req.body?.material
      };

        const product = await productService.createProduct(productBody);
        res.status(201).json(product);
})

const getAllProduct = catchAsync(async (req, res) => {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
})

const getProductById = catchAsync (async (req, res) => {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
})

const updateProduct = catchAsync(async (req, res) =>{
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json(product);
})

const deleteProduct = async (req, res) =>{
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
}

module.exports = {
    createNewProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
};
