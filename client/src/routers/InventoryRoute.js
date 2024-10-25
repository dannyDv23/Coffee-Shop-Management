const express = require('express');
const router = express.Router();
const path = require('path');
const addAuthHeaders = require('../middleware/auth');
const { fetchMaterials, fetchMaterialById } = require('../untils/materialUtils');

router.use(addAuthHeaders);
// Render inventory view with materials
router.get('/', async (req, res) => {
  try {
    const materials = await fetchMaterials(req); // Pass req to the utility function
    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageInventory", "ViewInventory"),
      materials: materials 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});

// Render import view
router.get('/import', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ImportMaterial") });
});

// Render export view with materials
router.get('/export', async (req, res) => {
  try {
    const materials = await fetchMaterials(req); // Pass req to the utility function
    res.render('../MainLayout', { 
      bodyPage: path.join("views", "manageInventory", "ExportMaterial"),
      materials: materials 
    });
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).send('Error fetching materials');
  }
});

// Render edit view for a specific material
router.get('/edit', async (req, res) => {
  const id = req.query.id;

  try {
    const material = await fetchMaterialById(req, id); // Pass req and id to the utility function
    res.render('../MainLayout', {
      bodyPage: path.join('views', 'manageInventory', 'EditMaterial'),
      material: material
    });
  } catch (error) {
    console.error('Error fetching material details:', error);
    res.status(500).send('Failed to fetch material details');
  }
});

// Render delete view (if needed, otherwise you might implement delete functionality)
router.get('/delete', (req, res) => {
  res.render('../MainLayout', { bodyPage: path.join("views", "manageInventory", "ViewInventory") });
});

module.exports = router;
