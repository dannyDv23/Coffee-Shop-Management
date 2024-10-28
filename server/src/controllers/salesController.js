const Sales = require('../models/sales');
const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");

exports.getAllSales = catchAsync(async (req, res, next) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.createSales = catchAsync(async (req, res, next) => {
    try {
        const { startDay, endDay, discount } = req.body;

        if (new Date(startDay) >= new Date(endDay)) {
            throw new ApiError('Start day must be before end day', 400);
        }

        if (discount >= 100) {
            throw new ApiError('Discount must be less than 100%', 400);
        }

        const sales = new Sales(req.body);
        await sales.save();
        res.status(201).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.updateSales = catchAsync(async (req, res, next) => {
    try {
        const { startDay, endDay, discount } = req.body;

        if (new Date(startDay) >= new Date(endDay)) {
            throw new ApiError('Start day must be before end day', 400);
        }

        if (discount >= 100) {
            throw new ApiError('Discount must be less than 100%', 400);
        }

        const sales = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.getSalesById = catchAsync(async (req, res, next) => {
    try {
        const sales = await Sales.findById(req.params.id);
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.createSales = catchAsync(async (req, res, next) => {
    try {
        const sales = new Sales(req.body);
        await sales.save();
        res.status(201).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.updateSales = catchAsync(async (req, res, next) => {
    try {
        const sales = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
});

exports.deleteSales = catchAsync(async (req, res, next) => {
    try {
        const sales = await Sales.findByIdAndDelete(req.params.id);
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});