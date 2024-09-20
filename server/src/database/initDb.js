const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const HistoryMaterial = require('../models/historyMaterial');
const HistoryMoney = require('../models/historyMoney');
const Material = require('../models/material');
const Order = require('../models/order');
const Product = require('../models/product');
const ProductMaterial = require('../models/productMaterial');
const Sales = require('../models/sales');
const Table = require('../models/table');

// Data arrays
const bookingData = [
  { customerName: 'John Doe', phoneNumber: '123456789', date: new Date(), time: '19:00', reason: 'Dinner', status: 'Confirmed', tableId: null },
  { customerName: 'Jane Smith', phoneNumber: '987654321', date: new Date(), time: '20:00', reason: 'Meeting', status: 'Pending', tableId: null },
];

const employeeData = [
  { username: 'johndoe', password: 'password123', role: 'Admin', salary: 50000, address: '123 Main St', phoneNumber: '987654321', status: 'Active' },
  { username: 'janesmith', password: 'password456', role: 'Employee', salary: 30000, address: '456 Elm St', phoneNumber: '123456789', status: 'Active' }
];

const equipmentData = [
  { name: 'Coffee Machine', quantity: 5, price: 300, totalPrice: 1500, date: new Date(), status: 'Active' },
  { name: 'Oven', quantity: 2, price: 500, totalPrice: 1000, date: new Date(), status: 'Pending' }
];

const materialData = [
  { name: 'Coffee Beans', unit: 'kg', totalQuantity: 100, status: 'Active' },
  { name: 'Flour', unit: 'kg', totalQuantity: 50, status: 'Active' }
];

const historyMoneyData = [
  { date: new Date(), name: 'Order #1', money: 50.00, status: 'Collect' },
  { date: new Date(), name: 'Order #2', money: 30.00, status: 'Collect' }
];

const productData = [
  { name: 'Coffee', price: 5.00, status: 'Available' },
  { name: 'Pastry', price: 3.00, status: 'Available' }
];

const salesData = [
  { name: 'Discount Summer', startDate: new Date(), endDate: new Date(), discount: 10 },
  { name: 'Holiday Special', startDate: new Date(), endDate: new Date(), discount: 15 }
];

const tableData = [
  { tableNumber: 1, status: 'Available' },
  { tableNumber: 2, status: 'Empty' }
];

const createInitialData = async () => {
  try {
    // Clear existing data
    await Booking.deleteMany({});
    await Employee.deleteMany({});
    await Equipment.deleteMany({});
    await HistoryMaterial.deleteMany({});
    await HistoryMoney.deleteMany({});
    await Material.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await ProductMaterial.deleteMany({});
    await Sales.deleteMany({});
    await Table.deleteMany({});

    // Insert tables first
    const tables = await Table.insertMany(tableData);

    // Now update bookingData with the correct tableIds
    bookingData[0].tableId = tables[0]._id;
    bookingData[1].tableId = tables[1]._id;

    // Insert other data
     await Booking.insertMany(bookingData);
     await Employee.insertMany(employeeData);
     await Equipment.insertMany(equipmentData);
    const materials = await Material.insertMany(materialData);
     await HistoryMoney.insertMany(historyMoneyData);
    const products = await Product.insertMany(productData);
    const sales = await Sales.insertMany(salesData);

    // Insert productMaterial data using product and material IDs
    const productMaterialsData = [
      { productId: products[0]._id, materialId: materials[0]._id, quantityUsed: 10 },
      { productId: products[1]._id, materialId: materials[1]._id, quantityUsed: 5 }
    ];
    await ProductMaterial.insertMany(productMaterialsData);

    const historyMaterialData = [
      { materialId: materials[0]._id, batchId: 'B001', datePurchase: new Date(), dateShipment: new Date(), quantity: 50, remainingQuantity: 30, price: 100.00, status: 'InStock' },
      { materialId: materials[1]._id, batchId: 'B002', datePurchase: new Date(), dateShipment: new Date(), quantity: 20, remainingQuantity: 10, price: 50.00, status: 'InStock' }
    ];
    await HistoryMaterial.insertMany(historyMaterialData);
    // Insert order data with product, table, and sale IDs
    const orderData = [
      { productId: products[0]._id, tableId: tables[0]._id, numberProduct: 2, saleId: null, price: 10.00, time: new Date(), status: 'Completed' },
      { productId: products[1]._id, tableId: tables[1]._id, numberProduct: 1, saleId: sales[0]._id, price: 3.00, time: new Date(), status: 'Pending' }
    ];
    await Order.insertMany(orderData);

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

module.exports = createInitialData;
