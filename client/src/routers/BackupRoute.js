const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render("../MainLayout", { bodyPage: path.join("views", "BackupPage") });
});

module.exports = router;