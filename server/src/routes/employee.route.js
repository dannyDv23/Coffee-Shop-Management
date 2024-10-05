const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const employeeController = require("../controllers/employee.controller");
const { auth, roleFilter } = require("../middlewares/auth");

router.get(
    "/",
    employeeController.getEmployees
);
module.exports = router;