// Controller/Catalog/catalogController.js

const Vehicle = require('../../Models/Vehicle');
const { Op } = require('sequelize');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findByPk(vehicleId);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        res.json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle details' });
    }
};

// Get vehicle metadata (brands, shapes, years)
exports.getVehicleMetadata = async (req, res) => {
    try {
        // Get unique brands
        const brands = await Vehicle.findAll({
            attributes: ['brand'],
            group: ['brand'],
            raw: true
        });
        
        // Get unique shapes
        const shapes = await Vehicle.findAll({
            attributes: ['shape'],
            group: ['shape'],
            raw: true
        });
        
        // Get unique model years
        const years = await Vehicle.findAll({
            attributes: ['modelYear'],
            group: ['modelYear'],
            order: [['modelYear', 'DESC']],
            raw: true
        });
        
        res.json({
            brands: brands.map(item => item.brand),
            shapes: shapes.map(item => item.shape),
            years: years.map(item => item.modelYear)
        });
    } catch (error) {
        console.error('Error fetching vehicle metadata:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle metadata' });
    }
};

// Filter and sort vehicles
exports.filterVehicles = async (req, res) => {
    try {
        const { brand, shape, year, accidents, hotDeals, sortBy, sortOrder } = req.query;
        
        // Build filter conditions
        const whereConditions = {};
        
        if (brand) {
            whereConditions.brand = brand;
        }
        
        if (shape) {
            whereConditions.shape = shape;
        }
        
        if (year) {
            whereConditions.modelYear = year;
        }
        
        if (accidents === 'yes') {
            whereConditions.hasAccidents = true;
        } else if (accidents === 'no') {
            whereConditions.hasAccidents = false;
        }
        
        if (hotDeals === 'yes') {
            whereConditions.isHotDeal = true;
        }
        
        // Build sort options
        let orderOptions = [];
        
        if (sortBy === 'price') {
            orderOptions.push(['price', sortOrder === 'desc' ? 'DESC' : 'ASC']);
        } else if (sortBy === 'mileage') {
            orderOptions.push(['mileage', sortOrder === 'desc' ? 'DESC' : 'ASC']);
        }
        
        // Query with filters and sorting
        const vehicles = await Vehicle.findAll({
            where: whereConditions,
            order: orderOptions.length > 0 ? orderOptions : undefined
        });
        
        res.json(vehicles);
    } catch (error) {
        console.error('Error filtering vehicles:', error);
        res.status(500).json({ error: 'Failed to filter vehicles' });
    }
};

// Get hot deals
exports.getHotDeals = async (req, res) => {
    try {
        const hotDeals = await Vehicle.findAll({
            where: {
                isHotDeal: true
            }
        });
        
        res.json(hotDeals);
    } catch (error) {
        console.error('Error fetching hot deals:', error);
        res.status(500).json({ error: 'Failed to fetch hot deals' });
    }
};