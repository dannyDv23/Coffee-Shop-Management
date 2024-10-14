const express = require('express');
const addExpensesController = require('../controllers/addExpenses.controller');
const router = express.Router();

// Định nghĩa các route để thêm khoản chi
router.post('/add-expenses', addExpensesController.addExpense);

module.exports = router;