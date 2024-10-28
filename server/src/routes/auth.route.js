const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const {authValidation, employeeValidation} = require("../validations");
const authController = require("../controllers/auth.controller");
const {auth} = require("../middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirName = "uploads";
        const dirPath = path.join(__dirname, "..", dirName);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        cb(null, dirPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({storage});

router.post(
    "/register",
    // auth["Admin"],
    // upload.single("profilePicture"),
    auth(["Admin"]),
    upload.single("profilePicture"),
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

router.post(
    "/logout",
    authController.logout
);

module.exports = router;
