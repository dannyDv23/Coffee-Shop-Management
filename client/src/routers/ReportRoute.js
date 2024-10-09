const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("../MainLayout", { bodyPage: path.join("views", "ReportPage") });
});

module.exports = router;
