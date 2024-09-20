const mongoose = require('mongoose');

const {
    ROLES,
    EMPLOYEE_STATUSES,
} = require('./constants');

const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    salary: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, enum: EMPLOYEE_STATUSES, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
