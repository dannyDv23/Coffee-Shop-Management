const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const tableController = require("../controllers/table.controller");

router.get(
    "/all",
    tableController.viewAllTable
);

router.get(
    "/list-can-booking",
    tableController.viewTableCanBook
);

router.get(
    "/status/:tableStatus",
    tableController.viewTableByStatus
);

router.get(
    "/:tableNumber",
    tableController.viewInfomationByTableNumber
);

router.post(
    "/move",
    tableController.moveTable
);

router.post(
    "/split",
    tableController.splitTable
);

router.post(
    "/merge",
    tableController.mergeTable
);

module.exports = router;
