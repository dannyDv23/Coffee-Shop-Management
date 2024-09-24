const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

// Define a route for the about page
router.get('/', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join('views', 'HomePage')});
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
