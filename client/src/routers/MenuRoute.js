const express = require('express');
const router = express.Router();
const path = require('path');
const addAuthHeaders = require('../middleware/auth');
const { getMenuData, getMaterialsData, getMenuById } = require('../untils/menuUtils'); // Assuming you placed the helper functions in `menuService.js`

// Apply authentication headers
router.use(addAuthHeaders);

// Route to view the menu
router.get('/', async (req, res) => {
  try {
    // Fetch menu data using helper function
    const menu = await getMenuData(req);

    // Render the view with the fetched menu data
    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageMenu", "ViewMenu"),
      menus: menu
    });
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).send('Error fetching menu');
  }
});

// Route to add a new menu
router.get('/add', async (req, res) => {
  try {
    // Fetch materials data using helper function
    const materials = await getMaterialsData(req);

    // Render the view with the fetched materials data
    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageMenu", "AddMenu"),
      materials: materials 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});

// Route to edit a menu
router.get('/edit', async (req, res) => {
  const id = req.query.id;

  try {
    // Fetch menu and materials data using helper functions
    const menu = await getMenuById(req, id);
    const materials = await getMaterialsData(req);
    

    // Render the view with the fetched menu and materials data
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'manageMenu', 'EditMenu'),
      menus: menu,
      materials: materials
    });
  } catch (err) {
    console.error('Error fetching menu details:', err);
    res.status(500).send('Failed to fetch menu details');
  }
});

// Route to delete a menu
router.get('/delete', (req, res) => {
  res.render('../MainLayout', { 
    bodyPage: path.join("views", "manageInventory", "ViewInventory")
  });
});

module.exports = router;
