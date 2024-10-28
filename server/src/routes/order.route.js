const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.get('/', orderController.getAllOrder);
router.get('/:number', orderController.getOrderByTableNumber);


module.exports = router;
