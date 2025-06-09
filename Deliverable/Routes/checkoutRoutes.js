const express = require('express');
const authenticateCheckout = require('../Controller/Order Management/authenticateCheckout');
const orderController = require('../Controller/Order Management/orderController');
const router = express.Router();

//route to authenticate if user is signed in or not before checkout
router.get('/authenticateCheckout', authenticateCheckout.authenticateUser); 

//route to login user before checkout
router.post('/login', authenticateCheckout.login);

//route to register user before checkout
router.post('/register', authenticateCheckout.register);

//route to verify shipping/payment info to confirm order
router.post('/orderController', orderController.verify);

//route to fetch shipping info if user is signed in during checkout process
router.get('/fetchShippingInfo', orderController.fetchShippingInfo);

module.exports = router;
