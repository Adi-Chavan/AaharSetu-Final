const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Check if user is logged in (for Navbar state)
router.get('/me', authController.getMe);

// Logout user
router.post('/logout', authController.logout);

module.exports = router;

