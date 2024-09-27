const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');


router.get('/', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join('views', 'AboutPage')});
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


module.exports = router;
