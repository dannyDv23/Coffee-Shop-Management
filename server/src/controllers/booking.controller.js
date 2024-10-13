const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { bookingService } = require("../services");
const ApiError = require("../utils/ApiError");

const getBookingByTableNumber = catchAsync(async (req, res) => {
    const tableNumbe = req.params.number;
    const infoBooking = await bookingService.getBookingNowByTableNumber(tableNumbe);
    res.status(200).send({infoBooking});
});

module.exports = {
    getBookingByTableNumber,
};
