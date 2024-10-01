const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation, employeeValidation } = require("../validations");
const authController = require("../controllers/auth.controller");
const { auth, roleFilter } = require("../middlewares/auth");
const { ROLES } = require("../models/constants");

router.post(
  "/register",
  auth,
  roleFilter(["Admin"]),
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
