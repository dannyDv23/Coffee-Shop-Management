const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Bảng thu
const Material = require('../models/material'); // Bảng chi
const Equipment = require('../models/equipment'); // Bảng chi tiết sản phẩm
const Employee = require('../models/employee'); // Bảng nhân viên
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit'); 

// Hàm tính số tháng giữa 2 ngày
function calculateMonthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Số tháng giữa 2 ngày (bao gồm cả tháng bắt đầu và tháng kết thúc)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}

// Lấy dữ liệu cho Bar Chart tổng hợp cả thu và chi
router.get('/bar-chart', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    };

    // Tính tổng tiền thu từ bảng Transaction (Order)
    const totalIncome = await Order.aggregate([
      { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalIncome: { $sum: '$price' } } },
    ]);

    // Tính tổng tiền chi từ bảng Material
    const totalExpense = await Material.aggregate([
        { $unwind: '$history' },
        { $match: { 'history.datePurchase': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$history.newQuantity', '$history.price'] } } } },
      ]);

    // Tính tổng tiền chi từ bảng Equipment
    const totalDetails = await Equipment.aggregate([
      { $match: dateFilter }, // Lọc theo khoảng thời gian
      { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
    ]);

    // Tính tổng lương nhân viên từ bảng Employee
    const totalSalary = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } }, // Tổng lương hàng tháng
    ]);

    // Tính số tháng giữa startDate và endDate
    const months = calculateMonthsBetween(startDate, endDate);
    const totalSalaryForPeriod = (totalSalary[0]?.totalSalary || 0) * months;

    const data = {
      labels: ['Income', 'Material Purchase', 'Equipment Purchase', 'Employee Salary'],
      datasets: [{
        label: 'Income and Expenses',
        data: [
          totalIncome[0]?.totalIncome || 0,
          totalExpense[0]?.totalMoney || 0,
          totalDetails[0]?.totalMoney || 0,
          totalSalaryForPeriod || 0, // Lương nhân viên tính cho số tháng
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cannot get bar chart data' });
  }
});

// Lấy dữ liệu cho Pie Chart theo các danh mục thu và chi
router.get('/pie-chart', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    };

    // Tính tổng tiền thu từ bảng Order với trạng thái "Completed"
    const totalIncome = await Order.aggregate([
      { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalIncome: { $sum: '$price' } } },
    ]);

    // Tính tổng tiền chi từ bảng Material
    const totalExpense = await Material.aggregate([
        { $unwind: '$history' },
        { $match: { 'history.datePurchase': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$history.newQuantity', '$history.price'] } } } },
      ]);

    // Tính tổng tiền chi từ bảng Equipment
    const totalDetails = await Equipment.aggregate([
      { $match: dateFilter }, // Lọc theo khoảng thời gian
      { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
    ]);

    // Tính tổng lương nhân viên từ bảng Employee
    const totalSalary = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } }, // Tổng lương hàng tháng
    ]);

    // Tính số tháng giữa startDate và endDate
    const months = calculateMonthsBetween(startDate, endDate);
    const totalSalaryForPeriod = (totalSalary[0]?.totalSalary || 0) * months;

    const labels = ['Income', 'Material Purchase', 'Equipment Purchase', 'Employee Salary'];
    const data = [
      totalIncome[0]?.totalIncome || 0,
      totalExpense[0]?.totalMoney || 0,
      totalDetails[0]?.totalMoney || 0,
      totalSalaryForPeriod || 0, // Lương nhân viên tính cho số tháng
    ];

    res.status(200).json({ labels, data });
  } catch (err) {
    res.status(500).json({ error: 'Cannot get pie chart data' });
  }
});
// Route lấy dữ liệu cho table
router.get('/report-table', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    };

    // Tính tổng tiền thu từ bảng Order
    const totalIncome = await Order.aggregate([
      { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalIncome: { $sum: '$price' } } },
    ]);

    // Tính tổng tiền chi từ bảng Material
    const totalExpense = await Material.aggregate([
        { $unwind: '$history' },
        { $match: { 'history.datePurchase': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$history.newQuantity', '$history.price'] } } } },
      ]);

    // Tính tổng tiền chi từ bảng Equipment
    const totalDetails = await Equipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
    ]);

    // Tính tổng lương nhân viên từ bảng Employee
    const totalSalary = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } },
    ]);

    // Tính số tháng giữa startDate và endDate
    const months = calculateMonthsBetween(startDate, endDate);
    const totalSalaryForPeriod = (totalSalary[0]?.totalSalary || 0) * months;

    // Dữ liệu trả về cho bảng
    const data = [
      { category: 'Income', amount: totalIncome[0]?.totalIncome || 0 },
      { category: 'Material Purchase', amount: totalExpense[0]?.totalMoney || 0 },
      { category: 'Equipment Purchase', amount: totalDetails[0]?.totalMoney || 0 },
      { category: 'Employee Salary', amount: totalSalaryForPeriod || 0 },
    ];

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cannot get report table data' });
  }
});


// Route xuất Excel
router.get('/export-excel', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    };

    // Tính tổng tiền thu từ bảng Order với trạng thái "Completed"
    const totalIncome = await Order.aggregate([
      { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalIncome: { $sum: '$price' } } },
    ]);

    // Tính tổng tiền chi từ bảng Material
    const totalExpense = await Material.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.datePurchase': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$history.newQuantity', '$history.price'] } } } },
    ]);

    // Tính tổng tiền chi từ bảng Equipment
    const totalDetails = await Equipment.aggregate([
      { $match: dateFilter }, // Lọc theo khoảng thời gian
      { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
    ]);

    // Tính tổng lương nhân viên từ bảng Employee
    const totalSalary = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } }, // Tổng lương hàng tháng
    ]);

    // Tính số tháng giữa startDate và endDate
    const months = calculateMonthsBetween(startDate, endDate);
    const totalSalaryForPeriod = (totalSalary[0]?.totalSalary || 0) * months;

    // Khởi tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Định nghĩa các cột cho file Excel
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Amount', key: 'amount', width: 20 },
    ];

    // Thêm dữ liệu vào file Excel
    worksheet.addRow({ category: 'Income', amount: totalIncome[0]?.totalIncome || 0 });
    worksheet.addRow({ category: 'Material Purchase', amount: totalExpense[0]?.totalMoney || 0 });
    worksheet.addRow({ category: 'Equipment Purchase', amount: totalDetails[0]?.totalMoney || 0 });
    worksheet.addRow({ category: 'Employee Salary', amount: totalSalaryForPeriod || 0 });

    // Định dạng header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }, // Màu nền xám nhạt
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Định dạng dữ liệu
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) { // Bỏ qua header
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (typeof cell.value === 'number') {
            cell.numFmt = '$#,##0.00'; // Định dạng số tiền
          }
        });
      }
    });

    // Thiết lập header cho file Excel và trả file về phía client
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report_${startDate}_to_${endDate}.xlsx`
    );

    // Ghi dữ liệu vào response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Cannot export Excel' });
  }
});


// Route xuất PDF
router.get('/export-pdf', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    };

    // Tính tổng tiền thu từ bảng Order với trạng thái "Completed"
    const totalIncome = await Order.aggregate([
      { $match: { status: 'Completed', time: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalIncome: { $sum: '$price' } } },
    ]);

    // Tính tổng tiền chi từ bảng Material
    const totalExpense = await Material.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.datePurchase': { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalMoney: { $sum: { $multiply: ['$history.newQuantity', '$history.price'] } } } },
    ]);

    // Tính tổng tiền chi từ bảng Equipment
    const totalDetails = await Equipment.aggregate([
      { $match: dateFilter }, // Lọc theo khoảng thời gian
      { $group: { _id: null, totalMoney: { $sum: '$totalPrice' } } },
    ]);

    // Tính tổng lương nhân viên từ bảng Employee
    const totalSalary = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } }, // Tổng lương hàng tháng
    ]);

    // Tính số tháng giữa startDate và endDate
    const months = calculateMonthsBetween(startDate, endDate);
    const totalSalaryForPeriod = (totalSalary[0]?.totalSalary || 0) * months;

    // Khởi tạo PDF
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Thiết lập header cho PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${startDate}_to_${endDate}.pdf`);

    // Stream PDF ra cho client
    doc.pipe(res);

    // Thêm tiêu đề với font in đậm, căn giữa và thêm dòng kẻ
    doc.fontSize(18).font('Helvetica-Bold').text('Report Summary', { align: 'center' });
    doc.moveDown(0.5);
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    
    // Thêm thời gian báo cáo với font nhỏ hơn
    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica').text(`Period: From ${startDate} to ${endDate}`, { align: 'left' });

    // Thêm dữ liệu Bar Chart vào PDF với khoảng cách giữa các mục và font chữ chuẩn
    doc.moveDown(1.5);
    doc.fontSize(14).font('Helvetica-Bold').text(' Income and Expenses', { lineGap: 10 });
    
    // Thêm từng mục vào với font thông thường
    doc.fontSize(12).font('Helvetica');
    doc.text(`Income: ${totalIncome[0]?.totalIncome || 0}`, { indent: 20 });
    doc.text(`Material Purchase: ${totalExpense[0]?.totalMoney || 0}`, { indent: 20 });
    doc.text(`Equipment Purchase: ${totalDetails[0]?.totalMoney || 0}`, { indent: 20 });
    doc.text(`Employee Salary: ${totalSalaryForPeriod || 0}`, { indent: 20 });
    
    // Thêm dòng phân cách cuối cùng để chia tách các phần nội dung
    doc.moveDown(1.5);
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Kết thúc và gửi PDF
    doc.end();
  } catch (err) {
    console.error('Error exporting PDF:', err);
    res.status(500).json({ error: 'Cannot export PDF' });
  }
});


module.exports = router;
