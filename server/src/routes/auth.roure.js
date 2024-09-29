const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation, employeeValidation } = require("../validations");
const authController = require("../controllers/auth.controller");

router.post(
  "/register",
  validate(employeeValidation.createEmployeeSchema),
  authController.register
);
router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login
);
router.post(
  "/refresh-token",
  validate(authValidation.refreshTokenSchema),
  authController.refreshToken
);

module.exports = router;
