const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

async function getEmployees(req) {
  try {
    const token = req.cookies["accessToken"];
    const { data } = await axios.get("http://localhost:3000/api/employee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
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

module.exports = router;
