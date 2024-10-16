// Đây là file budget.controller.js
const Order = require('../models/order');
const Material = require('../models/material');
const Equipment = require('../models/equipment');
const Employee = require('../models/employee');
const HistoryMoney = require('../models/historyMoney');



// Tính số ngày giữa giữa endDate - StartDate
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

// Hàm lấy tổng thu nhập (income)
const getTotalIncome = (startDate, endDate) => Order.aggregate([
  { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: null, totalIncome: { $sum: '$price' } } },
]);

// Hàm lấy tổng chi phí mua nguyên vật liệu
const getTotalMaterialExpense = (startDate, endDate) => Material.aggregate([
  { $unwind: '$importHistory' },
  { $match: { 'importHistory.dateImport': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$importHistory.quantity', '$importHistory.price'] } } } },
]);

// Hàm lấy tổng chi phí mua trang thiết bị
const getTotalEquipmentExpense = (startDate, endDate) => Equipment.aggregate([
  { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
]);

// Hàm tính lương nhân viên trong khoảng thời gian
const getTotalSalaryExpense = async (startDate, endDate) => {
  const totalSalary = await Employee.aggregate([
    { $group: { _id: null, totalSalary: { $sum: '$salary' } } },
  ]);

  const daysBetween = calculateDaysBetween(startDate, endDate);
  const start = new Date(startDate);
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();

  // Tính lương trung bình hàng ngày và nhân với số ngày trong khoảng thời gian
  return parseFloat((((totalSalary[0]?.totalSalary || 0) / daysInMonth) * daysBetween).toFixed(1));
};

// Hàm lấy tổng chi phí khác (other costs)
const getTotalOtherCost = (startDate, endDate) => HistoryMoney.aggregate([
  { $match: { status: 'Collect', date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: null, totalOtherCost: { $sum: '$money' } } },
]);

// Hàm lấy dữ liệu báo cáo ngân sách
const getBudgetData = async (startDate, endDate) => {
  try {
    const [totalIncome, totalMaterialExpense, totalEquipmentExpense, totalSalaryExpense, totalOtherCost] = await Promise.all([
      getTotalIncome(startDate, endDate),
      getTotalMaterialExpense(startDate, endDate),
      getTotalEquipmentExpense(startDate, endDate),
      getTotalSalaryExpense(startDate, endDate),
      getTotalOtherCost(startDate, endDate),
    ]);

    const profit = (totalIncome[0]?.totalIncome || 0) - (
      (totalMaterialExpense[0]?.totalMoney || 0) + 
      (totalEquipmentExpense[0]?.totalMoney || 0) + 
      totalSalaryExpense +
      (totalOtherCost[0]?.totalOtherCost || 0)
    );

    return {
      totalIncome: totalIncome[0]?.totalIncome || 0,
      totalMaterialExpense: totalMaterialExpense[0]?.totalMoney || 0,
      totalEquipmentExpense: totalEquipmentExpense[0]?.totalMoney || 0,
      totalSalaryExpense,
      totalOtherCost: totalOtherCost[0]?.totalOtherCost || 0,
      profit,
    };
  } catch (err) {
    console.error("Error in getBudgetData:", err);
    throw err; // Để lỗi này có thể được gửi lên phía client và trả lại status 500
  }
};

// Hàm xử lý API cho Table của ngân sách
const getBudgetTable = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const budgetData = await getBudgetData(startDate, endDate);

    const data = [
      { category: 'Income', amount: budgetData.totalIncome },
      { category: 'Material Purchase', amount: budgetData.totalMaterialExpense },
      { category: 'Equipment Purchase', amount: budgetData.totalEquipmentExpense },
      { category: 'Employee Salary', amount: budgetData.totalSalaryExpense },
      { category: 'Other Cost', amount: budgetData.totalOtherCost },
      { 
        category: 'Profit', 
        amount: budgetData.profit, 
        highlight: true, 
        color: budgetData.profit >= 0 ? 'green' : 'red' // Màu xanh lá cây nếu profit dương, màu đỏ nếu âm
      },
    ];

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cannot get budget table data' });
  }
};

// Hàm lấy lịch sử chi phí từ bảng historymoneys
const getExpenseHistory = async (req, res) => {
  try {
    const expenses = await HistoryMoney.find({}).select('name money date -_id').exec();
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error in getExpenseHistory:', err);
    res.status(500).json({ error: 'Cannot get expense history' });
  }
};

module.exports = {
  getBudgetTable,
  getExpenseHistory,
};
