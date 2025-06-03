// Routes/visitEventRoute.js

const express = require('express');
const router = express.Router();
const VisitEvent = require('../Models/VisitEvent');

// 1) LOG "VIEW DETAILS"
// 1) LOG "VIEW DETAILS" via POST
router.post('/view-details', async (req, res) => {
  try {
    const { ipaddress, day, vid } = req.body;

    if (!ipaddress || !day || !vid) {
      return res.status(400).json({ error: 'Missing ipaddress, day, or vid' });
    }

    await VisitEvent.create({
      ipaddress,
      day,
      eventtype: "VIEW_DETAILS",
      vid
    });

    res.json({ message: `Logged VIEW_DETAILS for vehicle ${vid}` });
  } catch (error) {
    console.error('Error logging VIEW_DETAILS event:', error);
    res.status(500).json({ error: 'Failed to log VIEW_DETAILS event' });
  }
});


// 2) POST /events/add-to-cart - log an "ADD_TO_CART" event using real IP from frontend
router.post('/add-to-cart', async (req, res) => {
  try {
    const { ipaddress, day, vid } = req.body;

    if (!ipaddress || !day || !vid) {
      return res.status(400).json({ error: 'Missing ipaddress, day, or vid' });
    }

    await VisitEvent.create({
      ipaddress,
      day,
      eventtype: "ADD_TO_CART",
      vid
    });

    res.json({ message: `Logged ADD_TO_CART for vehicle ${vid}` });
  } catch (error) {
    console.error('Error logging ADD_TO_CART event:', error);
    res.status(500).json({ error: 'Failed to log ADD_TO_CART event' });
  }
});



// 3) LOG "PURCHASE"
router.post('/purchase', async (req, res) => {
  try {
    const ipRaw = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
    let ipaddress = ipRaw;
    
    if (ipaddress === '::1' || ipaddress === '::ffff:127.0.0.1') {
      ipaddress = '127.0.0.1';
    }
    
    if (ipaddress.includes(',')) {
      ipaddress = ipaddress.split(',')[0].trim();
    }
    
    const now = new Date();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const year = now.getFullYear().toString();
    const currentDay = `${month}${day}${year}`;

    const { vid } = req.body;
    if (!vid) return res.status(400).json({ error: "Missing vid" });

    await VisitEvent.create({
      ipaddress,
      day: currentDay,
      eventtype: "PURCHASE",
      vid
    });

    res.json({ message: "Purchase event logged" });
  } catch (error) {
    console.error('Error logging purchase event:', error);
    res.status(500).json({ error: 'Failed to log purchase event' });
  }
});


// 4) RETRIEVE ALL EVENTS FOR ANALYTICS
router.get('/all', async (req, res) => {
  try {
    const events = await VisitEvent.findAll();
    res.json(events);
  } catch (error) {
    console.error('Error retrieving visit events:', error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

module.exports = router;
