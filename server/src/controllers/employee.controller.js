const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { employeeService } = require("../services");
const ApiError = require("../utils/ApiError");

const getEmployees = catchAsync(async (req, res) => {
  const employees = await employeeService.getEmployees();
  res.status(httpStatus.OK).send(employees);
});

module.exports = {
  getEmployees,
};
