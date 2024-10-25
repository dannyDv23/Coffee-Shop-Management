const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const { fetchAvailableTables, fetchBookableTables, fetchAllTables } = require('../untils/tableUtils');
const addAuthHeaders = require('../middleware/auth');

router.use(addAuthHeaders); // Apply auth middleware to all routes

router.get('/view', async (req, res) => {
  try {
    const listAllTable = await fetchAllTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'ViewTable'),
      datas: listAllTable,
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
    const listAvailableTable = await fetchAvailableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'MoveTable'),
      datas: listAvailableTable,
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
  try {
    const listTable = await fetchAvailableTables(req);
    const listTableSelected = await fetchBookableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'SplitTable'),
      listTable,
      listTableSelected,
      titleTab: 'Split Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/merge', async (req, res) => {
  try {
    const listTable = await fetchAvailableTables(req);
    const listTableSelected = await fetchBookableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'MergeTable'),
      listTable,
      listTableSelected,
      titleTab: 'Merge Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/cancel', async (req, res) => {
  try {
    const listTable = await fetchAvailableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'CancelTable'),
      listTable,
      titleTab: 'Cancel Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/chooseMenu', async (req, res) => {
  try {
    const listTable = await fetchAvailableTables(req);
    const responseProduct = await req.axios.get('http://localhost:3000/api/product');
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'ChooseMenu'),
      listTable,
      listproduct: responseProduct.data.listProduct,
      titleTab: 'Choose Menu'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/booking', async (req, res) => {
  try {
    const listTable = await fetchBookableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'BookingTable'),
      listTable,
      titleTab: 'Booking Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/payment', async (req, res) => {
  try {
    const listTable = await fetchAvailableTables(req);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'PaymentTable'),
      listTable,
      titleTab: 'Payment Table'
    });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'HomePage'),
      error: 'Error fetching data'
    });
  }
});

router.get('/print', (req, res) => {
  res.render('../MainLayout', {
    bodyPage: path.join('views', 'TablePage', 'PrintSetting'),
    titleTab: 'Print Setting'
  });
});

router.get('/managerBooking', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/booking');
    const infoBooking = response.data.infoBooking;

    res.render('../MainLayout', {
      bodyPage: path.join('views', 'TablePage', 'ManagerBookingTable'),
      infoBooking: infoBooking
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});


module.exports = router;
