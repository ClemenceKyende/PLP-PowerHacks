// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Registration Request:', { username, email, password });

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();
        console.log('User registered successfully:', user);

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username, email } });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ error: 'User registration failed' });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Log out user (token invalidation happens on the client-side)
exports.logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
