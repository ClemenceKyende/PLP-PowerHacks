const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profilePic: {
        type: String,
    },
    progress: {
        type: Number,
    },
    // Other profile-specific fields
    username: {
        type: String,
    },
    email: {
        type: String,
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
