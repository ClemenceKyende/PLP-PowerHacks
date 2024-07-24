const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage: storage });

// Existing user routes
router.get('/profile', protect, userController.getProfile);
router.put('/update', protect, userController.updateProfile);

// Profile-related routes
router.get('/getProfileInfo', protect, userController.getProfileInfo);
router.post('/updateProfileInfo', protect, upload.single('profilePic'), userController.updateProfileInfo);

module.exports = router;
