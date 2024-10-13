const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { orderService } = require("../services");
const ApiError = require("../utils/ApiError");



const getAllOrder = catchAsync(async (req, res) => {
    const infoOrder = await orderService.getAllOrder();
    res.status(200).send({infoOrder});
});

const getOrderByTableNumber = catchAsync(async (req, res) => {
    const tableNumber = req.params.number;
    const infoOrder = await orderService.getOrderNowFromTableNumber(tableNumber);
    res.status(200).send({infoOrder});
});

module.exports = {
    getOrderByTableNumber,
    getAllOrder
};
