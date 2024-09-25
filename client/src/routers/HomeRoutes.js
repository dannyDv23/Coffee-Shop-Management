const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

// Define a route for the about page

const pages = [
  { name: 'Home Page', description: 'Displays all functional categories and detailed purposes of each task in the menu', icon: 'fa-home' },
  { name: 'Profile Page', description: 'Allows users to view and edit their personal information', icon: 'fa-user' }, 
  { name: 'Employee Management', description: 'Manage employee data, roles, and permissions', icon: 'fa-users' },
  { name: 'Sales Management', description: 'Track and manage sales activities and transactions', icon: 'fa-chart-line' },
  { name: 'Equipment Management', description: 'Manage and monitor the status of business equipment', icon: 'fa-toolbox' },
  { name: 'Inventory Management', description: 'Manage stock levels, product entries, and warehouse data', icon: 'fa-box' },
  { name: 'Menu Management', description: 'Handle the creation, update, and organization of the menu', icon: 'fa-utensils' },
  { name: 'Marketing Management', description: 'Manage marketing strategies, campaigns, and outreach activities', icon: 'fa-bullhorn' }, 
  { name: 'Budget Management', description: 'Monitor and allocate budgets for various business operations', icon: 'fa-wallet' }, 
  { name: 'Data Management', description: 'Oversee the organization and control of business-related data', icon: 'fa-database' }, 
  { name: 'Statistics and Reports', description: 'Generate and display business statistics and reports for decision-making', icon: 'fa-chart-bar' },
  { name: 'About Page', description: 'Provides information about the business and its mission', icon: 'fa-info-circle' }
];



router.get('/', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join('views', 'HomePage'), datas: pages});
});

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

// Define other route relate to this router
router.get('/avatar', (req, res) => {
    res.render('../MainLayout', { bodyPage: path.join('views', 'AvartarPage')});
  });

  router.get('/dashboard', (req, res) => {
    res.render('../MainLayout', { bodyPage: path.join('views', 'Dashboard')});
  });


module.exports = router;
