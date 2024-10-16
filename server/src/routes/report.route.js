const express = require('express');
const reportController = require('../controllers/report.controller');
const router = express.Router();

router.get('/bar-chart', reportController.getBarChart);
router.get('/pie-chart', reportController.getPieChart);
router.get('/report-table', reportController.getReportTable);
router.get('/export-excel', reportController.exportExcel);
router.get('/export-pdf', reportController.exportPdf);

module.exports = router;
