const Order = require('../models/order');
const Material = require('../models/material');
const Equipment = require('../models/equipment');
const Employee = require('../models/employee');
const HistoryMoney = require('../models/historyMoney');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

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

// Hàm lấy tổng chi phí khác từ bảng historymoney
const getTotalOtherCost = (startDate, endDate) => HistoryMoney.aggregate([
  { $match: { status: 'Collect', date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: null, totalOtherCost: { $sum: '$money' } } },
]);

// Hàm lấy dữ liệu cho báo cáo
const getReportData = async (startDate, endDate) => {
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
};

// Hàm xử lý API cho Bar Chart
const getBarChart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportData = await getReportData(startDate, endDate);
    
    const data = {
      labels: ['Income', 'Material Purchase', 'Equipment Purchase', 'Employee Salary', 'Other Cost'],
      datasets: [{
        label: 'Income and Expenses',
        data: [
          reportData.totalIncome,
          reportData.totalMaterialExpense,
          reportData.totalEquipmentExpense,
          reportData.totalSalaryExpense,
          reportData.totalOtherCost,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }]
    };
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cannot get bar chart data' });
  }
};

// Hàm xử lý API cho Pie Chart
const getPieChart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportData = await getReportData(startDate, endDate);

    res.status(200).json({
      labels: ['Income', 'Material Purchase', 'Equipment Purchase', 'Employee Salary', 'Other Cost'],
      data: [
        reportData.totalIncome,
        reportData.totalMaterialExpense,
        reportData.totalEquipmentExpense,
        reportData.totalSalaryExpense,
        reportData.totalOtherCost,
      ],
    });
  } catch (err) {
    res.status(500).json({ error: 'Cannot get pie chart data' });
  }
};

// Hàm xử lý API cho Table
const getReportTable = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportData = await getReportData(startDate, endDate);

    const data = [
      { category: 'Income', amount: reportData.totalIncome },
      { category: 'Material Purchase', amount: reportData.totalMaterialExpense },
      { category: 'Equipment Purchase', amount: reportData.totalEquipmentExpense },
      { category: 'Employee Salary', amount: reportData.totalSalaryExpense },
      { category: 'Other Cost', amount: reportData.totalOtherCost },
      { 
        category: 'Profit', 
        amount: reportData.profit, 
        highlight: true, 
        color: reportData.profit >= 0 ? 'green' : 'red' 
      },
    ];

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cannot get report table data' });
  }
};

// Hàm xuất báo cáo ra Excel
const exportExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportData = await getReportData(startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Amount', key: 'amount', width: 20 },
    ];

    worksheet.addRows([
      { category: 'Income', amount: reportData.totalIncome.toLocaleString('en-US') },
      { category: 'Material Purchase', amount: reportData.totalMaterialExpense.toLocaleString('en-US') },
      { category: 'Equipment Purchase', amount: reportData.totalEquipmentExpense.toLocaleString('en-US') },
      { category: 'Employee Salary', amount: reportData.totalSalaryExpense.toLocaleString('en-US') },
      { category: 'Other Cost', amount: reportData.totalOtherCost.toLocaleString('en-US') },
      { category: 'Profit', amount: reportData.profit.toLocaleString('en-US') }
    ]);
    const profitRow = worksheet.lastRow;
    profitRow.eachCell((cell) => {
      cell.font = { bold: true };  // In đậm
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE699' } }; // Màu vàng nhạt
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report_${startDate}_to_${endDate}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Cannot export Excel' });
  }
};

// Hàm xuất báo cáo ra PDF
const exportPdf = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportData = await getReportData(startDate, endDate);

    const doc = new PDFDocument({ margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${startDate}_to_${endDate}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('Report Summary', { align: 'center' });
    doc.moveDown(0.5).lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1).fontSize(12).font('Helvetica').text(`Period: From ${startDate} to ${endDate}`, { align: 'left' });

    doc.moveDown(1.5).fontSize(14).font('Helvetica-Bold').text('Income and Expenses', { lineGap: 10 });
    doc.fontSize(12).font('Helvetica');
    doc.text(`Income: ${reportData.totalIncome.toLocaleString('en-US')}`, { indent: 20 });
    doc.text(`Material Purchase: ${reportData.totalMaterialExpense.toLocaleString('en-US')}`, { indent: 20 });
    doc.text(`Equipment Purchase: ${reportData.totalEquipmentExpense.toLocaleString('en-US')}`, { indent: 20 });
    doc.text(`Employee Salary: ${reportData.totalSalaryExpense.toLocaleString('en-US')}`, { indent: 20 });
    doc.text(`Other Cost: ${reportData.totalOtherCost.toLocaleString('en-US')}`, { indent: 20 });


    doc.moveDown(1.5).lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5).fontSize(14).font('Helvetica-Bold').text(`Profit: ${reportData.profit.toLocaleString('en-US')}`, { indent: 20 });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Cannot export PDF' });
  }
};

module.exports = {
  getBarChart,
  getPieChart,
  getReportTable,
  exportExcel,
  exportPdf,
};
