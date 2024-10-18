const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const employeeController = require("../controllers/employee.controller");
const {employeeValidation} = require("../validations");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.get("/", employeeController.getEmployees);
router.put(
    "/:id",
    upload.single("profilePicture"),
    validate(employeeValidation.updateEmployeeSchema),
    employeeController.updateEmployee
);
router.delete(
    "/:id",
    validate(employeeValidation.deleteEmployeeSchema),
    employeeController.deleteEmployee
);
module.exports = router;
