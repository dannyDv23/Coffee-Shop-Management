const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const infomationTable = [
  { number: 'Table 1', status: 'Empty', textStyle: 'color-sunset', listProduct: [] },
  { number: 'Table 2', status: 'Empty', textStyle: 'color-sunset', listProduct: [] },
  {
    number: 'Table 3', status: 'Available', textStyle: 'color-mint', listProduct: [
      { name: "Product 1", quantity: 1 },
      { name: "Product 2", quantity: 2 },
      { name: "Product 3", quantity: 3 },
    ]
  },
  {
    number: 'Table 4', status: 'Available', textStyle: 'color-mint', listProduct: [
      { name: "Product 1", quantity: 4 },
      { name: "Product 2", quantity: 5 },
      { name: "Product 3", quantity: 6 },
    ]
  },
  { number: 'Table 5', status: 'Empty', textStyle: 'color-sunset', listProduct: [] },
  { number: 'Table 6', status: 'Empty', textStyle: 'color-sunset', listProduct: [] },

];

//example when call api
// router.get('/', async (req, res) => {
//   try {
//       const newsAPI = await axios.get('http://localhost:3000/info/namphuong');
//       res.render('../MainLayout', { 
//           bodyPage: path.join('views', 'HomePage'),
//           articles: newsAPI.data 
//       });
//   } catch (err) {
//       console.error('Error fetching data:', err.message);
//       res.render('../MainLayout', { 
//           bodyPage: path.join('views', 'HomePage'),
//           error: 'Error fetching data' 
//       });
//   }
// });


router.get('/view', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/table/all');
    const listTable = response.data.listTable;
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage','ViewTable'),
      datas: listTable,
      titleTab: 'View Table'
    });

  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }

});

router.get('/move', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/table/status/Available');
    const listAvailableTable = response.data.listTable;
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage/TablePage'),
      datas: listAvailableTable,
      detailPage: path.join('views', '../../TablePage/MoveTable'),
      titleTab: 'Move Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/split', async (req, res) => {
  const responseAvailableTable = await axios.get('http://localhost:3000/api/table/status/Available');
  const responseTableBook = await axios.get('http://localhost:3000/api/table/list-can-booking');
  const listTable = responseAvailableTable.data.listTable;
  const listTableSelected = responseTableBook.data.listTableCanBook;
  res.render('../MainLayout', {
    bodyPage: path.join('views', 'TablePage','SplitTable'),
    listTable: listTable,
    listTableSelected: listTableSelected,
    titleTab: 'Split Table'
  });
});

router.get('/merge', async(req, res) => {
  const responseAvailableTable = await axios.get('http://localhost:3000/api/table/status/Available');
  const responseTableBook = await axios.get('http://localhost:3000/api/table/list-can-booking');
  const listTable = responseAvailableTable.data.listTable;
  const listTableSelected = responseTableBook.data.listTableCanBook;
  res.render('../MainLayout', {
    bodyPage: path.join('views', 'TablePage','MergeTable'),
    listTable: listTable,
    listTableSelected: listTableSelected,
    titleTab: 'Merge Table'
  });
});

router.get('/cancel', async(req, res) => {
  const responseAvailableTable = await axios.get('http://localhost:3000/api/table/status/Available');
  const listTable = responseAvailableTable.data.listTable;
  res.render('../MainLayout', {
    bodyPage: path.join('views', 'TablePage','CancelTable'),
    listTable: listTable,
    titleTab: 'Cancel Table'
  });
});

router.get('/chooseMenu', async(req, res) => {
  const responseAvailableTable = await axios.get('http://localhost:3000/api/table/status/Available');
  const responseProduct = await axios.get('http://localhost:3000/api/product');
  const listTable = responseAvailableTable.data.listTable;
  const listproduct = responseProduct.data.listProduct;
  res.render('../MainLayout', {
    bodyPage: path.join('views', 'TablePage','ChooseMenu'),
    listTable: listTable,
    listproduct: listproduct,
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
