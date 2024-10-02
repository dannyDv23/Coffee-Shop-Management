const Sales = require('../models/sales');
const ApiError = require('../utils/ApiError');

exports.getAllSales = async (req, res, next) => {
    try {
        const sales = await Sales.find();
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};

exports.getSalesById = async (req, res, next) => {
    try {
        const sales = await Sales.findById(req.params.id);
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};

exports.createSales = async (req, res, next) => {
    try {
        const sales = new Sales(req.body);
        await sales.save();
        res.status(201).json(sales);
    } catch (error) {
        next(error);
    }
};

exports.updateSales = async (req, res, next) => {
    try {
        const sales = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};

exports.deleteSales = async (req, res, next) => {
    try {
        const sales = await Sales.findByIdAndDelete(req.params.id);
        if (!sales) {
            throw new ApiError('Sales not found', 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};