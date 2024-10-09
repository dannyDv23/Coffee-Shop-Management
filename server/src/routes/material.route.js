const express = require('express');
const materialController = require('../controllers/material.controller');

const router = express.Router();

router.post('/', materialController.createMaterial);
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterialById);
router.put('/:id', materialController.updateMaterial);
router.put('/delete/:id', materialController.deleteMaterial);
router.post('/:id/import', materialController.addImportHistory); 
router.post('/export', materialController.exportMaterial); 

module.exports = router;
