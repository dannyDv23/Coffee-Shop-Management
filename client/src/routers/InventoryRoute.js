const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');



// router.get('/', (req, res) => {
//   res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ViewInventory")});
// });

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/material');
    const materials = response.data; // Extract data from the response

    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageInventory", "ViewInventory"),
      materials: materials 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});


router.get('/import', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ImportMaterial")});
});

router.get('/export', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/material');
    const materials = response.data; // Extract data from the response

    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageInventory", "ExportMaterial"),
      materials: materials 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});


router.get('/edit', async (req, res) => {
  const id = req.query.id;

  try {
    const response = await axios.get(`http://localhost:3000/api/material/${id}`);
    const material = response.data;

    res.render('../MainLayout', {
      bodyPage: path.join('views', 'manageInventory', 'EditMaterial'),
      material: material
    });
  } catch (error) {
    console.error('Error fetching material details:', error);
    res.status(500).send('Failed to fetch material details');
  }
});


router.get('/delete', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ViewInventory")});
});

router.get('/find', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "FindMaterial")});
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

module.exports = router;
