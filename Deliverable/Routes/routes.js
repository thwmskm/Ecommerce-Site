const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'index.html'));
    });  

router.get('/authentication', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'authentication.html'));
  });  

router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'cart.html'));
  });

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'login.html'));
  });
  
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'register.html'));
  });

router.get('/vehicle-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'vehicle-details.html'));
  });

router.get('/compare', (req, res) => {
    res.sendFile(path.join(__dirname, '../View', 'compare.html'));
  });

module.exports = router;
