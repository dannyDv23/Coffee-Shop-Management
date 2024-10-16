const express = require('express');
const menuController = require('../controllers/menu.controller');

const router = express.Router();

router.post('/', menuController.createNewProduct);
router.get('/', menuController.getAllProduct);
router.get('/:id', menuController.getProductById);
router.put('/:id', menuController.updateProduct);
router.delete('/:id', menuController.deleteProduct);

module.exports = router;
