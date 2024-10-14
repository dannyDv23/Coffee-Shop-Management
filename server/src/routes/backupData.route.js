// backupData.route.js

const express = require('express');
const backupController = require('../controllers/backupData.controller');
const router = express.Router();

// Endpoint để sao lưu dữ liệu
router.get('/backup-data', backupController.backupData);

module.exports = router;
