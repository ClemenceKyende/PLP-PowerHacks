// controllers/userController.js
const User = require('../models/user');
const Profile = require('../models/profile');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
};

// Profile-related functions

// Get profile information
exports.getProfileInfo = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update profile information
exports.updateProfileInfo = async (req, res) => {
    try {
        let profilePic = req.body.profilePic; // Preserve old picture if not updated
        if (req.file) {
            profilePic = req.file.path; // Save the file path
        }

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            progress: req.body.progress, // Example field
            profilePic // Update picture path if provided
        };

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            updateData,
            { new: true }
        );

        if (!updatedProfile) return res.status(404).json({ success: false, message: 'Profile not found' });
        res.json({ success: true, profile: updatedProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
