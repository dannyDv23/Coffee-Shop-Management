const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("../views/LoginPage", { bodyPage: path.join("views", "LoginPage") });
});

module.exports = router;
