const Employee = require("../models/employee");
const Auth = require("../models/auth");

const createEmployee = async (employeeBody) => {
  const employee = await Employee.create({
    name: employeeBody.name,
    address: employeeBody.address,
    position: employeeBody.position,
    salary: employeeBody.salary,
    phoneNumber: employeeBody.phoneNumber,
    avatar: employeeBody.avatar,

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

const getEmployees = async () => {
  return await Employee.find();
};

const getEmployeeByPhoneNumber = async (phoneNumber) => {
  return await Employee.findOne({ phoneNumber });
};
module.exports = {
  createEmployee,
  getEmployeeByUsername,
  getAuthById,
  getEmployees,
  getEmployeeByPhoneNumber,
};
