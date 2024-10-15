const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const {tokenService, authService, employeeService} = require("../services");
const ApiError = require("../utils/ApiError");

const register = catchAsync(async (req, res) => {
    const {
        name,
        username,
        password,
        retypePassword,
        position,
        salary,
        phoneNumber,
        address,
    } = req.body;
    
    const imagePath = req.file?.path;
    const imageKey = `profile-images/${req.file.filename}`;

    let imageUrl = null;
    if (imagePath && imageKey) {
        imageUrl = await employeeService.processUserProfileImage(imagePath, imageKey, null);
    }

    const existingEmployee = await employeeService.getEmployeeByUsername(
        username
    );
    const exstingPhoneNumber = await employeeService.getEmployeeByPhoneNumber(
        phoneNumber
    );
    if (existingEmployee) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }
    if (password !== retypePassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
    }
    if (exstingPhoneNumber) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken");
    }
    const {employee, authRecord} = await employeeService.createEmployee({
        name,
        username,
        password,
        position,
        salary,
        phoneNumber,
        address,
        avatar: {url: imageUrl, imageKey},
    });
    const tokens = await tokenService.generateAuthTokens(employee._id);
    res.status(httpStatus.CREATED).send({employee, tokens, authRecord});
});

const login = catchAsync(async (req, res) => {
    const {username, password} = req.body;
    const employee = await authService.login(username, password);
    const tokens = await tokenService.generateAuthTokens(employee.id);
    res.cookie("accessToken", tokens.access.token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
    });
    res.status(httpStatus.OK).send({employee, tokens});
});

const refreshToken = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.status(httpStatus.OK).send({...tokens});
});

module.exports = {
    register,
    login,
    refreshToken,
};
