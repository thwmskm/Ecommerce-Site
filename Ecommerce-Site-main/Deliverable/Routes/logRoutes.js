// Routes/logRoutes.js
const express = require("express");
const router = express.Router();
const { VisitEvent } = require("../Models"); // Import your model

router.post("/", async (req, res) => {
  try {
    const { eventType, vehicleId } = req.body;

    // Insert a row in VisitEvent to record the event
    await VisitEvent.create({
      eventType,      // e.g. "VIEW", "CART", or "PURCHASE"
      vid: vehicleId, // match your 'vid' column
      ipaddress: req.ip,
      day: new Date().toISOString().slice(0,10).replaceAll("-","")  
      // or however you're storing the date in 'day' column (e.g. "YYYYMMDD")
    });
    
    res.json({ message: "Event logged successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log event" });
  }
});

module.exports = router;
