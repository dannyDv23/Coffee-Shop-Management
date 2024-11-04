const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/view-all", async (req, res) => {
    const response = await fetch("http://152.42.165.4:3000/api/sales", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    res.render("../MainLayout", { bodyPage: path.join("views", "AllSalesPage"), sales: result });
});

router.get("/create", (req, res) => {
    res.render("../MainLayout", { bodyPage: path.join("views", "CreateSalePage") });
});

router.get("/update/:id", async (req, res) => {
    const response = await fetch(`http://152.42.165.4:3000/api/sales/${req.params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    console.log("🚀 ~ router.get ~ result:", result)
    res.render("../MainLayout", { bodyPage: path.join("views", "UpdateSalePage"), sale: result });
});

module.exports = router;
