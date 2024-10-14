const Booking = require('../models/booking');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const HistoryMoney = require('../models/historyMoney');
const Material = require('../models/material');
const Order = require('../models/order');
const Product = require('../models/product');
const Sales = require('../models/sales');
const Table = require('../models/table');

const backupData = async (req, res) => {
    try {
        // Lấy dữ liệu từ tất cả các model, ngoại trừ auth và token
        const bookings = await Booking.find({});
        const employees = await Employee.find({});
        const equipments = await Equipment.find({});
        const historyMoneys = await HistoryMoney.find({});
        const materials = await Material.find({});
        const orders = await Order.find({});
        const products = await Product.find({});
        const sales = await Sales.find({});
        const tables = await Table.find({});

        // Chuẩn bị nội dung cho file backup
        let backupContent = "=== Booking Data ===\n" + JSON.stringify(bookings, null, 2) + "\n\n";
        backupContent += "=== Employee Data ===\n" + JSON.stringify(employees, null, 2) + "\n\n";
        backupContent += "=== Equipment Data ===\n" + JSON.stringify(equipments, null, 2) + "\n\n";
        backupContent += "=== History Money Data ===\n" + JSON.stringify(historyMoneys, null, 2) + "\n\n";
        backupContent += "=== Material Data ===\n" + JSON.stringify(materials, null, 2) + "\n\n";
        backupContent += "=== Order Data ===\n" + JSON.stringify(orders, null, 2) + "\n\n";
        backupContent += "=== Product Data ===\n" + JSON.stringify(products, null, 2) + "\n\n";
        backupContent += "=== Sales Data ===\n" + JSON.stringify(sales, null, 2) + "\n\n";
        backupContent += "=== Table Data ===\n" + JSON.stringify(tables, null, 2) + "\n\n";

        // Đặt header để tải xuống file .txt
        res.setHeader('Content-disposition', 'attachment; filename=backup_data.txt');
        res.setHeader('Content-Type', 'text/plain');
        res.send(backupContent);

    } catch (err) {
        console.error('Error backing up data:', err);
        res.status(500).json({ error: 'Không thể sao lưu dữ liệu' });
    }
};

module.exports = {
    backupData,
};
