const Vehicle = require('../../Models/Vehicle');

exports.getVehiclesToCompare = async (req, res) => {
    try {
        const { ids } = req.query;
        
        if (!ids) {
            return res.status(400).json({ error: 'No vehicle IDs provided' });
        }
        
        // Parse the comma-separated vehicle IDs
        const vehicleIds = ids.split(',').map(id => parseInt(id.trim(), 10));
        
        // Validate that we have at least 2 IDs and at most 4
        if (vehicleIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 vehicles are needed for comparison' });
        }
        
        if (vehicleIds.length > 4) {
            return res.status(400).json({ error: 'Cannot compare more than 4 vehicles at once' });
        }
        
        // Fetch the requested vehicles
        const vehicles = await Vehicle.findAll({
            where: {
                vid: vehicleIds
            }
        });
        
        if (vehicles.length === 0) {
            return res.status(404).json({ error: 'No vehicles found with the provided IDs' });
        }
        
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles for comparison:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles for comparison' });
    }
};
