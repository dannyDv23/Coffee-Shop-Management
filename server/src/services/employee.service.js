const Employee = require("../models/employee");
const Auth = require("../models/auth");

const createEmployee = async (employeeBody) => {
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
const getEmployeeByUsername = async (username) => {
  return await Auth.findOne({ username });
};

const getAuthById = async (id) => {
  return await Auth.findById(id);
};

module.exports = {
  createEmployee,
  getEmployeeByUsername,
  getAuthById,
};
