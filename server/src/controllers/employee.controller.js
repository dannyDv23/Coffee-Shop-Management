const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const {employeeService} = require("../services");
const ApiError = require("../utils/ApiError");

const getEmployees = catchAsync(async (req, res) => {
    const employees = await employeeService.getEmployees();
    res.status(httpStatus.OK).send(employees);
});

const updateEmployee = catchAsync(async (req, res) => {

    const employeeId = req.params.id;
    const currentImageKey = await employeeService.getCurrentImageKey(employeeId);

    const imagePath = req.file?.path;
    const imageKey = `profile-images/${req.file.filename}`;
    let imageUrl = null;
    if (imagePath && imageKey && currentImageKey) {
        imageUrl = await employeeService.processUserProfileImage(imagePath, imageKey, currentImageKey);
    }

    const employeeBody = {
        name: req.body?.name,
        address: req.body?.address,
        position: req.body?.position,
        salary: req.body?.salary,
        phoneNumber: req.body?.phoneNumber,
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
