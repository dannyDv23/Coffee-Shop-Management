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
  const employees = await Employee.find();

  const employeeDetails = await Promise.all(
    employees.map(async (employee) => {
      const authRecord = await Auth.findOne({ employeeId: employee._id });
      return {
        ...employee._doc,
        username: authRecord ? authRecord.username : null,
      };
    })
  );

  return employeeDetails;
};

const getEmployeeByPhoneNumber = async (phoneNumber) => {
  return await Employee.findOne({ phoneNumber });
};

const updateEmployee = async (employeeId, employeeBody) => {
  const employee = await Employee.findByIdAndUpdate(employeeId, employeeBody, {
    new: true,
  });
  const newPassword = employeeBody.password;
  if (
    newPassword &&
    newPassword.length > 0 &&
    newPassword === employeeBody.retypePassword
  ) {
    const authRecord = await Auth.findOne({ employeeId });
    authRecord.password = newPassword;
    await authRecord.save();
  }
  return employee;
};

const deleteEmployee = async (employeeId) => {
  return await Employee.findByIdAndDelete(employeeId);
};
module.exports = {
  createEmployee,
  getEmployeeByUsername,
  getAuthById,
  getEmployees,
  getEmployeeByPhoneNumber,
  updateEmployee,
  deleteEmployee,
};
