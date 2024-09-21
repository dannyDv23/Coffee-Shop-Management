const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Continuous Deployment completed successfully!");
});

module.exports = router;
