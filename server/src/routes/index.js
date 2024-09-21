const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Continuous Deployment Successfully!");
});

module.exports = router;
