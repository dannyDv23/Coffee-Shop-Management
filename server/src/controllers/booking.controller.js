const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { bookingService } = require("../services");
const ApiError = require("../utils/ApiError");

const getBookingByTableNumber = catchAsync(async (req, res) => {
    const tableNumbe = req.params.number;
    const infoBooking = await bookingService.getBookingByTableNumber(tableNumbe);
    res.status(200).send({infoBooking});
});

const getAllBooking = catchAsync(async (req, res) => {
    const infoBooking = await bookingService.getAllBooking();
    res.status(200).send({infoBooking});
});

const updateBookingById = catchAsync(async (req, res) => {
    const { bookingId, status } = req.body;

    try {
        const result = await bookingService.updateStatusBookingById(bookingId, status);
        return res.json(result);
    } catch (error) {
        console.error('Error completing order:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = {
    getBookingByTableNumber,
    updateBookingById,
    getAllBooking,
};
