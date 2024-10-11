const express = require('express');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

router.get('/:number', bookingController.getBookingByTableNumber);


module.exports = router;
