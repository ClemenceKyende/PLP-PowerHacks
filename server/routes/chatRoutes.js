const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController'); // Ensure handleChat is defined

router.post('/', handleChat);  // Updated to match '/api/chat'

module.exports = router;
