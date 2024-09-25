const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: false },
  salary: { type: Number, required: false },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  avatar: { type: String, required: false },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
