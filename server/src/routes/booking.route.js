const express = require('express');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

router.get('/:number', bookingController.getBookingByTableNumber);
router.get('/', bookingController.getAllBooking);
router.post('/update', bookingController.updateBookingById);

module.exports = router;