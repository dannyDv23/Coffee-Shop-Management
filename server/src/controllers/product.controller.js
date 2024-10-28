const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { productService  } = require("../services");
const ApiError = require("../utils/ApiError");


const viewAllProductController = catchAsync(async (req, res) => {
    const listProduct = await productService.getAllProducts();
    res.status(httpStatus.OK).send({ listProduct });
});


module.exports = {
    viewAllProductController
};
