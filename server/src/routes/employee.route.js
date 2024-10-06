const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const employeeController = require("../controllers/employee.controller");
const { employeeValidation } = require("../validations");

router.get("/", employeeController.getEmployees);
router.put(
  "/:id",
  validate(employeeValidation.updateEmployeeSchema),
  employeeController.updateEmployee
);
router.delete(
  "/:id",
  validate(employeeValidation.deleteEmployeeSchema),
  employeeController.deleteEmployee
);
module.exports = router;
