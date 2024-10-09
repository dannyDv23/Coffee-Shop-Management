// const mongoose = require('mongoose');
// const Booking = require('../models/booking');
// const Employee = require('../models/employee');
// const Equipment = require('../models/equipment');
// const HistoryMoney = require('../models/historyMoney');
// const Material = require('../models/material');
// const Order = require('../models/order');
// const Product = require('../models/product');
// const Sales = require('../models/sales');
// const Table = require('../models/table');

// // Data arrays
// const bookingData = [
//   { customerName: 'John Doe', phoneNumber: '123456789', date: new Date(), time: '19:00', reason: 'Dinner', status: 'Now', tableId: null },
//   { customerName: 'Jane Smith', phoneNumber: '987654321', date: new Date(), time: '20:00', reason: 'Meeting', status: 'Appointment', tableId: null },
// ];

// const employeeData = [
//   { name: 'johndoe', position: 'Admin', salary: 50000, address: '123 Main St', phoneNumber: '987654321', status: 'Active' },
//   { name: 'janesmith', position: 'Employee', salary: 30000, address: '456 Elm St', phoneNumber: '123456789', status: 'Active' }
// ];

// const equipmentData = [
//   { name: 'Coffee Machine', quantity: 5, price: 300, totalPrice: 1500, date: new Date(), status: 'Active' },
//   { name: 'Oven', quantity: 2, price: 500, totalPrice: 1000, date: new Date(), status: 'Pending' }
// ];

// const materialData = [
//   {
//     name: 'Coffee Beans', unit: 'kg', totalQuantity: 100, status: 'Active',
//     history: [
//       { datePurchase: new Date(), dateShipment: new Date(), newQuantity: 50, remainingQuantity: 30, price: 100.00, status: 'InStock' }
//     ]
//   },
//   {
//     name: 'Flour', unit: 'kg', totalQuantity: 50, status: 'Active',
//     history: [
//       { datePurchase: new Date(), dateShipment: new Date(), newQuantity: 20, remainingQuantity: 10, price: 50.00, status: 'InStock' }
//     ]
//   }
// ];

// const historyMoneyData = [
//   { date: new Date(), name: 'Order #1', money: 50.00, status: 'Collect' },
//   { date: new Date(), name: 'Order #2', money: 30.00, status: 'Collect' }
// ];

// const productData = [
//   {
//     name: 'Coffee', price: 5.00, status: 'Available',
//     material: [{ materialId: null, quantityUsed: 10 }] // Will be updated later with material IDs
//   },
//   {
//     name: 'Pastry', price: 3.00, status: 'Available',
//     material: [{ materialId: null, quantityUsed: 5 }] // Will be updated later with material IDs
//   }
// ];

// const salesData = [
//   { name: 'Discount Summer', startDate: new Date(), endDate: new Date(), discount: 10 },
//   { name: 'Holiday Special', startDate: new Date(), endDate: new Date(), discount: 15 }
// ];

// const tableData = [
//   { tableNumber: 1, status: 'Available' },
//   { tableNumber: 2, status: 'Empty' }
// ];

// const createInitialData = async () => {
//   try {
//     console.log("wait create initial data");

//     // Clear existing data (Uncomment if you want to reset the database)
//     // await Booking.deleteMany({});
//     // await Employee.deleteMany({});
//     // await Equipment.deleteMany({});
//     // await HistoryMoney.deleteMany({});
//     // await Material.deleteMany({});
//     // await Order.deleteMany({});
//     // await Product.deleteMany({});
//     // await Sales.deleteMany({});
//     // await Table.deleteMany({});

//     // Insert tables
//     const tableCount = await Table.countDocuments();
//     let tables;
//     if (!tableCount) {
//       tables = await Table.insertMany(tableData);
//     } else {
//       tables = await Table.find();
//     }

//     // Update bookingData with table IDs
//     bookingData[0].tableId = tables[0]._id;
//     bookingData[1].tableId = tables[1]._id;

//     // Insert bookings
//     const bookingCount = await Booking.countDocuments();
//     if (!bookingCount) {
//       await Booking.insertMany(bookingData);
//     }

//     // Insert employees
//     const employeeCount = await Employee.countDocuments();
//     if (!employeeCount) {
//       await Employee.insertMany(employeeData);
//     }

//     // Insert equipment
//     const equipmentCount = await Equipment.countDocuments();
//     if (!equipmentCount) {
//       await Equipment.insertMany(equipmentData);
//     }

//     // Insert materials
//     const materialCount = await Material.countDocuments();
//     let materials;
//     if (!materialCount) {
//       materials = await Material.insertMany(materialData);
//     } else {
//       materials = await Material.find();
//     }

//     // Update product materials with material IDs
//     productData[0].material[0].materialId = materials[0]._id;
//     productData[1].material[0].materialId = materials[1]._id;

//     // Insert products
//     const productCount = await Product.countDocuments();
//     let products;
//     if (!productCount) {
//       products = await Product.insertMany(productData);
//     } else {
//       products = await Product.find();
//     }

//     // Insert sales
//     const salesCount = await Sales.countDocuments();
//     let sales;
//     if (!salesCount) {
//       sales = await Sales.insertMany(salesData);
//     } else {
//       sales = await Sales.find();
//     }

//     // Insert history money
//     const historyMoneyCount = await HistoryMoney.countDocuments();
//     if (!historyMoneyCount) {
//       await HistoryMoney.insertMany(historyMoneyData);
//     }

//     // Insert orders
//     const orderCount = await Order.countDocuments();
//     if (!orderCount) {
//       const orders = [
//         {
//           product: [{ productId: products[0]._id, numberProduct: 2 }],
//           tableId: tables[0]._id,
//           saleId: null,
//           price: 10.00,
//           time: new Date(),
//           status: 'Completed'
//         },
//         {
//           product: [{ productId: products[1]._id, numberProduct: 1 }],
//           tableId: tables[1]._id,
//           saleId: sales[0]._id,
//           price: 3.00,
//           time: new Date(),
//           status: 'Pending'
//         }
//       ];
//       await Order.insertMany(orders);
//     }

//     console.log('Initial data insertion complete!');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   }
// };

// module.exports = createInitialData;


const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const HistoryMoney = require('../models/historyMoney');
const Material = require('../models/material');
const Order = require('../models/order');
const Product = require('../models/product');
const Sales = require('../models/sales');
const Table = require('../models/table');

// Manually generating ObjectIDs for tables
const tableIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

// Data arrays with tableIds
const tableData = [
  { _id: tableIds[0], tableNumber: 1, status: 'Available' },
  { _id: tableIds[1], tableNumber: 2, status: 'Empty' },
  { _id: tableIds[2], tableNumber: 3, status: 'Empty' },
  { _id: tableIds[3], tableNumber: 4, status: 'Empty' }
];

const bookingData = [
  { customerName: 'John Doe', phoneNumber: '123456789', date: new Date(), time: '19:00', reason: 'Dinner', status: 'Now', tableId: tableIds[0] },
  { customerName: 'Jane Smith', phoneNumber: '987654321', date: new Date(), time: '20:00', reason: 'Meeting', status: 'Appointment', tableId: tableIds[1] },
];

const employeeData = [
  { name: 'johndoe', position: 'Admin', salary: 50000, address: '123 Main St', phoneNumber: '987654321', status: 'Active' },
  { name: 'janesmith', position: 'Employee', salary: 30000, address: '456 Elm St', phoneNumber: '123456789', status: 'Active' }
];

const equipmentData = [
  { name: 'Coffee Machine', quantity: 5, price: 300, totalPrice: 1500, date: new Date(), status: 'Active' },
  { name: 'Oven', quantity: 2, price: 500, totalPrice: 1000, date: new Date(), status: 'Pending' }
];

const materialData = [
  {
    name: 'Coffee Beans', unit: 'kg', totalQuantity: 100, status: 'Active',
    history: [
      { datePurchase: new Date(), dateShipment: new Date(), newQuantity: 50, remainingQuantity: 30, price: 100.00, status: 'InStock' }
    ]
  },
  {
    name: 'Flour', unit: 'kg', totalQuantity: 50, status: 'Active',
    history: [
      { datePurchase: new Date(), dateShipment: new Date(), newQuantity: 20, remainingQuantity: 10, price: 50.00, status: 'InStock' }
    ]
  }
];

const historyMoneyData = [
  { date: new Date(), name: 'Order #1', money: 50.00, status: 'Collect' },
  { date: new Date(), name: 'Order #2', money: 30.00, status: 'Collect' }
];

const productData = [
  {
    name: 'Coffee', price: 5.00, status: 'Available',
    material: [{ materialId: null, quantityUsed: 10 }] // Will be updated later with material IDs
  },
  {
    name: 'Pastry', price: 3.00, status: 'Available',
    material: [{ materialId: null, quantityUsed: 5 }] // Will be updated later with material IDs
  }
];

const salesData = [
  { name: 'Discount Summer', startDate: new Date(), endDate: new Date(), discount: 10 },
  { name: 'Holiday Special', startDate: new Date(), endDate: new Date(), discount: 15 }
];

const createInitialData = async () => {
  try {
    console.log("wait create initial data");
    // Clear existing data (Uncomment if you want to reset the database)
    // await Booking.deleteMany({});
    // await Employee.deleteMany({});
    // await Equipment.deleteMany({});
    // await HistoryMoney.deleteMany({});
    // await Material.deleteMany({});
    // await Order.deleteMany({});
    // await Product.deleteMany({});
    // await Sales.deleteMany({});
    // await Table.deleteMany({});
    // Insert tables first if not already present
    const tableCount = await Table.countDocuments();
    if (!tableCount) {
      await Table.insertMany(tableData);
    } else {
      await Table.find();
    }

    // Insert bookings or fetch existing
    const bookingCount = await Booking.countDocuments();
    if (!bookingCount) {
      await Booking.insertMany(bookingData);
    } else {
      await Booking.find();
    }

    // Insert employees or fetch existing
    const employeeCount = await Employee.countDocuments();
    if (!employeeCount) {
      await Employee.insertMany(employeeData);
    } else {
      await Employee.find();
    }

    // Insert equipment or fetch existing
    const equipmentCount = await Equipment.countDocuments();
    if (!equipmentCount) {
      await Equipment.insertMany(equipmentData);
    } else {
      await Equipment.find();
    }

    // Insert materials or fetch existing
    const materialCount = await Material.countDocuments();
    let materials;
    if (!materialCount) {
      materials = await Material.insertMany(materialData);

      // Update product materials with material IDs
      productData[0].material[0].materialId = materials[0]._id;
      productData[1].material[0].materialId = materials[1]._id;
    } else {
      materials = await Material.find();
    }

    // Insert history money or fetch existing
    const historyMoneyCount = await HistoryMoney.countDocuments();
    if (!historyMoneyCount) {
      await HistoryMoney.insertMany(historyMoneyData);
    } else {
      await HistoryMoney.find();
    }

    // Insert products or fetch existing
    const productCount = await Product.countDocuments();
    let products;
    if (!productCount) {
      products = await Product.insertMany(productData);
    } else {
      products = await Product.find();
    }

    // Insert sales or fetch existing
    const salesCount = await Sales.countDocuments();
    let sales;
    if (!salesCount) {
      sales = await Sales.insertMany(salesData);
    } else {
      sales = await Sales.find();
    }

    // Insert orders or fetch existing
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
      const orders = [
        {
          product: [{ productId: products[0]._id, numberProduct: 2 }],
          tableId: tableIds[0], // Using the manually assigned tableIds
          saleId: null,
          price: 10.00,
          time: new Date(),
          status: 'Completed'
        },
        {
          product: [{ productId: products[1]._id, numberProduct: 1 }],
          tableId: tableIds[1], // Using the manually assigned tableIds
          saleId: sales[0]._id,
          price: 3.00,
          time: new Date(),
          status: 'Pending'
        }
      ];
      await Order.insertMany(orders);
    }

    console.log('Initial data insertion complete!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

module.exports = createInitialData;
