const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

async function getEmployees(req) {
  try {
    const token = req.cookies["accessToken"];
    const { data } = await axios.get("http://152.42.165.4:3000/api/employee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
    return data;
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return [];
  }
}

router.get("/", async (req, res) => {
  const employees = await getEmployees(req);
  res.render("../MainLayout", {
    bodyPage: path.join("views", "manageEmployee", "EmployeesPage"),
    datas: employees,
  });
});

router.get("/add", async (req, res) => {
  res.render("../MainLayout", {
    bodyPage: path.join("views", "manageEmployee", "AddEmployee"),
  });
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const employees = await getEmployees(req);
  const employee = employees.find((employee) => employee._id === id);
  res.render("../MainLayout", {
    bodyPage: path.join("views", "manageEmployee", "EditEmployee"),
    employee: employee,
  });
});

router.get("/delete", async (req, res) => {
  const employees = await getEmployees(req);
  res.render("../MainLayout", {
    bodyPage: path.join("views", "manageEmployee", "DeleteEmployee"),
    datas: employees,
  });
});

module.exports = router;
