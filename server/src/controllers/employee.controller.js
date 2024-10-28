const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const {employeeService} = require("../services");
const ApiError = require("../utils/ApiError");
const Employee = require("../models/employee");

const getEmployees = catchAsync(async (req, res) => {
    const employees = await employeeService.getEmployees();
    res.status(httpStatus.OK).send(employees);
});

const updateEmployee = catchAsync(async (req, res) => {

    const employeeId = req.params.id;
    const currentImageKey = await employeeService.getCurrentImageKey(employeeId);

    let imageUrl = await employeeService.getImageUrl(employeeId);
    let imageKey = await employeeService.getCurrentImageKey(employeeId);

    if (req.file) {
        const imagePath = req.file?.path;
        imageKey = `profile-images/${req.file.filename}`;
        imageUrl = await employeeService.processUserProfileImage(imagePath, imageKey, currentImageKey);
    }

    const existingEmployee = await Employee.findOne({
        phoneNumber: req.body?.phoneNumber,
        _id: { $ne: employeeId }
    });

    if (existingEmployee) {
        throw new ApiError( httpStatus.BAD_REQUEST, "Phone number already exists for another employee.");
    }

    const employeeBody = {
        name: req.body?.name,
        address: req.body?.address,
        position: req.body?.position,
        salary: req.body?.salary,
        phoneNumber: req.body?.phoneNumber,
        password: req.body?.password,
        retypePassword: req.body?.retypePassword,
        avatar: {
            url: imageUrl,
            imageKey: imageKey,
        }
    };

    if (
        req.body.password &&
        req.body.retypePassword &&
        req.body.password !== req.body.retypePassword
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
    }

    const employee = await employeeService.updateEmployee(
        req.params.id,
        employeeBody
    );
    res.status(httpStatus.OK).send(employee);
});

const deleteEmployee = catchAsync(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    res.status(httpStatus.OK).send();
});

module.exports = {
    getEmployees,
    updateEmployee,
    deleteEmployee,
};
