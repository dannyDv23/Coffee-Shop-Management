const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const Emloyee = require("../models/employee");
const httpStatus = require("http-status");

router.get("/", auth(["Employee", "Admin"]), async (req, res) => {
  const employeeId = req.user.employeeId;
  const employeeInfo = await Emloyee.findOne({ _id: employeeId }).lean();
  const username = req.user.username;
  const role = req.user.role;
  const employeeData = { ...employeeInfo, username, role };
  res.status(httpStatus.OK).json(employeeData);
});

module.exports = router;
