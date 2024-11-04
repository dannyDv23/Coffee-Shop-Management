const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");

router.get("/view-all", async (req, res) => {
    const response = await fetch("http://152.42.165:3000/api/equipments", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    res.render("../MainLayout", { bodyPage: path.join("views", "AllEquipmentPage"), equipments: result });
});

router.get("/create", (req, res) => {
    res.render("../MainLayout", { bodyPage: path.join("views", "CreateEquipmentPage") });
});

router.get("/update/:id", async (req, res) => {
    const response = await fetch(`http://152.42.165:3000/api/equipments/${req.params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    res.render("../MainLayout", { bodyPage: path.join("views", "UpdateEquipmentPage"), equipment: result });
});

module.exports = router;
