const express = require("express");
const router = express.Router();
const path = require("path");
const { Op } = require("sequelize");
const { ItemSold } = require("../Models"); // Ensure this is correctly exported from index.js
const sequelize = require("../config/Database");

// ✅ Serve the admin analytics HTML page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../View/adminAnalytics.html"));
});

// ✅ Serve the API JSON data for items sold
router.get("/items-sold", async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const itemsSold = await ItemSold.findAll({
      where: {
        saleDate: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    let totalRevenue = 0;
    const results = itemsSold.map((item) => {
      const revenue = parseFloat(item.priceAtSale) * item.quantitySold;
      totalRevenue += revenue;
      return {
        vehicleId: item.vehicleId,
        saleDate: item.saleDate,
        quantitySold: item.quantitySold,
        priceAtSale: item.priceAtSale,
      };
    });

    res.json({
      items: results,
      totalRevenue: totalRevenue.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching items sold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/log-visit", async (req, res) => {
  try {
    const { ipaddress, day, vid, eventtype } = req.body;

    if (!ipaddress || !day || !vid || !eventtype) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await sequelize.query(
      "INSERT INTO VisitEvent (ipaddress, day, vid, eventtype) VALUES (?, ?, ?, ?)",
      {
        replacements: [ipaddress, day, vid, eventtype],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(200).json({ message: "Visit logged successfully" });
  } catch (err) {
    console.error("❌ Error logging visit:", err);
    res.status(500).json({ error: "Failed to log visit" });
  }
});

module.exports = router;
