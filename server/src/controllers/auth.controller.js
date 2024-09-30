const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { tokenService, authService, employeeService } = require("../services");
const ApiError = require("../utils/ApiError");

const register = catchAsync(async (req, res) => {
  const { name, username, password, retypePassword } = req.body;
  const existingEmployee = await employeeService.getEmployeeByUsername(
    username
  );
  if (existingEmployee) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  if (password !== retypePassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }
  const { employee, authRecord } = await employeeService.createEmployee({
    name,
    username,
    password,
  });
  const tokens = await tokenService.generateAuthTokens(employee._id);
  res.status(httpStatus.CREATED).send({ employee, tokens, authRecord });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const employee = await authService.login(username, password);
  const tokens = await tokenService.generateAuthTokens(employee.id);
  res.status(httpStatus.OK).send({ employee, tokens });
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

module.exports = {
  register,
  login,
  refreshToken,
};
