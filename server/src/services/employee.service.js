const Employee = require("../models/employee");
const Auth = require("../models/auth");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createEmployee = async (employeeBody) => {
  const existingUser = await Auth.findOne({ username: employeeBody.username });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  const employee = await Employee.create({
    name: employeeBody.name,
    // Add other necessary fields
  });
  const authRecord = await Auth.create({
    username: employeeBody.username,
    password: employeeBody.password,
    employeeId: employee.id,
  });

  return { employee, authRecord };
};
const getEmployeeById = async (id) => {
  return await Employee.findById(id);

};

module.exports = {
  createEmployee,
  getEmployeeById,
};
