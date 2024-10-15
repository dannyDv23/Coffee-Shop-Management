// budget.route.js
const express = require('express');
const budgetController = require('../controllers/budget.controller');
const router = express.Router();

// Endpoint để lấy dữ liệu báo cáo ngân sách
router.get('/budget-table', budgetController.getBudgetTable);

// Endpoint để lấy lịch sử các chi phí từ historymoneys
router.get('/expense-history', budgetController.getExpenseHistory);

module.exports = router;
