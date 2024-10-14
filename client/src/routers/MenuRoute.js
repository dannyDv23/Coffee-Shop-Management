const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');



// router.get('/', (req, res) => {
//   res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ViewInventory")});
// });

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/menu');
    const menu = response.data; // Extract data from the response

    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageMenu", "ViewMenu"),
      menus: menu 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});


router.get('/add', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/material');
    console.log("🚀 ~ router.get ~ response:", response)
    const material = response.data;
    console.log("🚀 ~ router.get ~ material:", material)
    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageMenu", "AddMenu"),
      materials: material 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});


router.get('/edit', async (req, res) => {
  const id = req.query.id;

  try {
    const responseMenu = await axios.get(`http://localhost:3000/api/menu/${id}`);
    const responseMaterial = await axios.get('http://localhost:3000/api/material');
    const menus = responseMenu.data;
    const materials = responseMaterial.data;

    // Pass the materials from the menus object directly
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'manageMenu', 'EditMenu'),
      menus: menus,
      materials: materials
    });
  } catch (error) {
    console.error('Error fetching menu details:', error);
    res.status(500).send('Failed to fetch menu details');
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
