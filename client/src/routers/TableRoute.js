const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const infomationTable = [
  { number: 'Table 1', status: 'Empty', textStyle: 'color-sunset',listProduct: []},
  { number: 'Table 2', status: 'Empty', textStyle: 'color-sunset', listProduct: []},
  { number: 'Table 3', status: 'Available', textStyle: 'color-mint', listProduct: [
    { name: "Product 1", quantity: 1 },
    { name: "Product 2", quantity: 2},
    { name: "Product 3", quantity: 3},
]},
  { number: 'Table 4', status: 'Available', textStyle: 'color-mint', listProduct: [
    { name: "Product 1", quantity: 4 },
    { name: "Product 2", quantity: 5 },
    { name: "Product 3", quantity: 6 },
]},
  { number: 'Table 5', status: 'Empty', textStyle: 'color-sunset', listProduct: []},
  { number: 'Table 6', status: 'Empty', textStyle: 'color-sunset', listProduct: []},
  
];



router.get('/view', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/ViewTable') ,
    titleTab: 'View Table'
  });
});

router.get('/move', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/MoveTable'),
    titleTab: 'Move Table'
  });
});

router.get('/split', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/SplitTable'),
    titleTab: 'Split Table'
  });
});

router.get('/merge', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/MergeTable'),
    titleTab: 'Merge Table'
  });
});

router.get('/cancel', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/CancelTable'),
    titleTab: 'Cancel Table'
  });
});

router.get('/chooseMenu', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/ChooseMenu'),
    titleTab: 'Choose Menu'
  });
});

router.get('/booking', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/BookingTable'),
    titleTab: 'Booking Table'
  });
});

router.get('/payment', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/PaymentTable'),
    titleTab: 'Payment Table '
  });
});

router.get('/print', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join('views', 'TablePage/TablePage'), 
    datas: infomationTable, 
    detailPage: path.join('views', '../../TablePage/PrintSetting'),
    titleTab: 'table payment'
  });
});

module.exports = router;
