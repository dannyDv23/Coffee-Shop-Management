const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { tokenService, authService, employeeService } = require("../services");
const e = require("express");

const register = catchAsync(async (req, res) => {
  const { employee, authRecord } = await employeeService.createEmployee(req.body);
  const tokens = await tokenService.generateAuthTokens(employee._id);
  res.status(httpStatus.CREATED).send({ employee, tokens, authRecord });
});

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const employee = await authService.login(username, password);
  const tokens = await tokenService.generateAuthTokens(employee);
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
