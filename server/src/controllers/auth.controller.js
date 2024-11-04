const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { tokenService, authService, employeeService } = require("../services");
const ApiError = require("../utils/ApiError");
const Employee = require("../models/employee");

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

  if (req.file) {
    const imagePath = req.file?.path;
    const imageKey = `profile-images/${req.file.filename}`;

    let imageUrl = null;
    if (imagePath && imageKey) {
      imageUrl = await employeeService.processUserProfileImage(
        imagePath,
        imageKey,
        null
      );
    }
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
  const { employee, authRecord } = await employeeService.createEmployee({
    name,
    username,
    password,
    position,
    salary,
    phoneNumber,
    address,
    avatar: req.file ? { url: imageUrl, imageKey } : null,
  });
  const tokens = await tokenService.generateAuthTokens(employee._id);
  res.status(httpStatus.CREATED).send({ employee, tokens, authRecord });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const employee = await authService.login(username, password);
  const employeeName = await Employee.findOne(employee.employeeId);
  const tokens = await tokenService.generateAuthTokens(employee.id);
  res.cookie("accessToken", tokens.access.token, {
    httpOnly: true,
    secure: false, // Set to true in production
    maxAge: 60 * 60 * 1000,
    sameSite: "Lax",
    domain: "152.42.165.4", // Domain should match the frontend domain
  });
  res
    .status(httpStatus.OK)
    .send({
      employee: { role: employee.role, name: employeeName.name },
      tokens,
    });
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    domain: "152.42.165.4",
  }).clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    domain: "152.42.165.4",
  });
  res.status(httpStatus.OK).send({ message: "Logged out successfully" });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
