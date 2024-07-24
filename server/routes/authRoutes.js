const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to register a new user
router.post('/register', authController.registerUser);

// Route to log in a user
router.post('/login', authController.loginUser);

// Route to log out a user (optional, based on implementation)
router.post('/logout', authController.logoutUser);

module.exports = router;
