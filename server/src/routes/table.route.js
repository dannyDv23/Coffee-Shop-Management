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
    tableController.moveTableController
);

router.post(
    "/split",
    tableController.splitTableController
);

router.post(
    "/merge",
    tableController.mergeTableController
);

router.put(
    "/cancel/:tableNumber",
    tableController.cancelTableController
);

router.post(
    '/order',
    tableController.orderProductTableController
);

module.exports = router;
