const Customization = require('../../Models/Customization');
const Vehicle = require('../../Models/Vehicle');

exports.getCustomizationOptions = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        
        // Verify vehicle exists
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        // Get customization options for this vehicle
        const customizations = await Customization.findAll({
            where: { vid:vehicleId },
            attributes: ['id', 'category', 'name', 'description', 'priceAdjustment']
        });
        
        // Group customizations by category
        const groupedCustomizations = customizations.reduce((acc, custom) => {
            if (!acc[custom.category]) {
                acc[custom.category] = [];
            }
            acc[custom.category].push({
                id: custom.id,
                name: custom.name,
                description: custom.description,
                priceAdjustment: custom.priceAdjustment
            });
            return acc;
        }, {});
        
        res.json(groupedCustomizations);
    } catch (error) {
        console.error('Error fetching customization options:', error);
        res.status(500).json({ error: 'Failed to fetch customization options' });
    }
};

exports.applyCustomization = async (req, res) => {
    try {
        const { vehicleId, customizationIds } = req.body;
        
        // Verify vehicle exists
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        // Fetch selected customizations
        const customizations = await Customization.findAll({
            where: { 
                id: customizationIds,
                vid: vehicleId 
            }
        });
        
        // Calculate total price adjustment
        const totalPriceAdjustment = customizations.reduce(
            (total, custom) => total + Number(custom.priceAdjustment),
            0
          );
          
        
        // Return vehicle with customization details
        res.json({
            vehicle,
            customizations,
            finalPrice: Number(vehicle.price) + totalPriceAdjustment

        });
    } catch (error) {
        console.error('Error applying customizations:', error);
        res.status(500).json({ error: 'Failed to apply customizations' });
    }
};
