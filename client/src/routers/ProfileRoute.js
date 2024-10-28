const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

async function getEmployee(req) {
  try {
    const token = req.cookies["accessToken"];
    const { data } = await axios.get("http://localhost:3000/api/profile", {
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
  const employee = await getEmployee(req);
  res.render("../MainLayout", {
    bodyPage: path.join("views", "employeeProfile", "ProfilePage"),
    employee: employee,
  });
});

router.get("/edit", async (req, res) => {
  const employee = await getEmployee(req);
  res.render("../MainLayout", {
    bodyPage: path.join("views", "manageEmployee", "EditEmployee"),
    employee: employee,
  });
});

module.exports = router;
