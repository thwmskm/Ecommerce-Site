const express = require('express');
const router = express.Router();
const { Vehicle } = require('../Models');  // Import the Vehicle model
const Sequelize = require('sequelize');

// Route to search vehicles by brand, model, and hot deal status
router.get('/search-vehicles', async (req, res) => {
  const { brand, model, isHotDeal } = req.query;

  try {
    const whereConditions = {};

    // Dynamically apply filters based on the query params

    if (model) {
      whereConditions.model = {
        [Sequelize.Op.like]: `%${model}%`, // Case-insensitive matching
      };
    }

    if (isHotDeal !== undefined) {
      whereConditions.isHotDeal = isHotDeal === 'true';  // Convert 'true'/'false' string to boolean
    }

    // If no valid query parameters are provided, return a message
    if (!brand && !model && isHotDeal === undefined) {
      return res.json({ message: 'Please provide a search criteria (model, basic questions or hot deal status).' });
    }

    const vehicles = await Vehicle.findAll({
      where: whereConditions,
    });

 

    // Respond with the list of vehicles that match the criteria
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Route to fetch hot deals (if `isHotDeal` is true)
router.get('/hot-deals', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { isHotDeal: true },  // Filter to only return hot deals
    });

    if (vehicles.length === 0) {
      return res.json({ message: 'No hot deals available at the moment.' });
    }

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    res.status(500).json({ message: 'An error occurred while fetching hot deals.' });
  }
});

module.exports = router;
