const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation, employeeValidation } = require("../validations");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post(
  "/register",
  // auth["Admin"],
  validate(employeeValidation.createEmployeeSchema),
  upload.single('avatar'),
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
