// budget.route.js
const express = require('express');
const budgetController = require('../controllers/budget.controller');
const router = express.Router();

// Endpoint để lấy dữ liệu báo cáo ngân sách
router.get('/budget-table', budgetController.getBudgetTable);

// Endpoint để lấy lịch sử các chi phí từ historymoneys
router.get('/expense-history', budgetController.getExpenseHistory);

// Endpoint để cập nhật một khoản chi phí
router.put('/expense-history/:id', budgetController.updateExpense);

// Endpoint để xóa một khoản chi phí
router.delete('/expense-history/:id', budgetController.deleteExpense);
module.exports = router;
