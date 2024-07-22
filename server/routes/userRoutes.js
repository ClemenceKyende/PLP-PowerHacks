const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Ensure authMiddleware is used for authorization

router.get('/profile', protect, userController.getProfile);
router.put('/update', protect, userController.updateProfile);

module.exports = router;