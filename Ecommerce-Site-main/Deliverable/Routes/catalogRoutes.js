const express = require('express');
const catalogController = require('../Controller/Catalog/catalogController');
const customizationController = require('../Controller/Catalog/customizationController');
const reviewController = require('../Controller/Catalog/reviewController');
const comparisonController = require('../Controller/Catalog/comparisonController');
const router = express.Router();

router.get('/vehicles', catalogController.getAllVehicles);
router.get('/metadata', catalogController.getVehicleMetadata);
router.get('/vehicles/:id', catalogController.getVehicleById);
router.get('/filter', catalogController.filterVehicles);
router.get('/hotdeals', catalogController.getHotDeals);
router.get('/vehicles/:vehicleId/customizations', customizationController.getCustomizationOptions);
router.post('/vehicles/apply-customization', customizationController.applyCustomization);
router.post('/vehicles/reviews', reviewController.createReview);
router.get('/vehicles/:id/reviews', reviewController.getReviews);
router.get('/compare', comparisonController.getVehiclesToCompare);

module.exports = router;
