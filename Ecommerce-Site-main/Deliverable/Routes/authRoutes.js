const express = require('express');
const authController = require('../Controller/Identity Management/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/userInfo', authController.userInfo); 

module.exports = router;
