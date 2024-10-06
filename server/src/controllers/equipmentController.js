const Equipment = require('../models/equipment');
const ApiError = require('../utils/ApiError');
const catchAsync = require("../utils/catchAsync");

exports.getAllEquipments = catchAsync(async (req, res, next) => {
    try {
        const equipments = await Equipment.find();
        res.status(200).json(equipments);
    } catch (error) {
        next(error);
    }
});

exports.getEquipmentById = catchAsync(async (req, res, next) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            throw new ApiError('Equipment not found', 404);
        }
        res.status(200).json(equipment);
    } catch (error) {
        next(error);
    }
});

exports.createEquipment = catchAsync(async (req, res, next) => {
    try {
        const {name} = req.body;
        const existingEquipment = await Equipment.findOne({name});
        if (existingEquipment) {
            throw new ApiError('Equipment already exists', 400);
        }
        const equipment = new Equipment(req.body);
        await equipment.save();
        res.status(201).json(equipment);
    } catch (error) {
        next(error);
    }
});

exports.updateEquipment = catchAsync(async (req, res, next) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!equipment) {
            throw new ApiError('Equipment not found', 404);
        }
        res.status(200).json(equipment);
    } catch (error) {
        next(error);
    }
});

exports.deleteEquipment = catchAsync(async (req, res, next) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);
        if (!equipment) {
            throw new ApiError('Equipment not found', 404);
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});