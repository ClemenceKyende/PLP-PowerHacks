const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dbConfig = require('./config/dbConfig.js');
const initializeAI = require('./config/aiConfig.js'); 

// Load environment variables
dotenv.config();

// Initialize AI service
const openai = initializeAI();  // Initialize AI service

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set up routes for views
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/courses.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/courses.html'));
});

app.get('/course.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/course.html'));
});

app.get('/quizzes.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/quizzes.html'));
});

app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/quiz.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/profile.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/chat.html'));
});

// Import and use routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware'); // Correct import

// Use routes for API endpoints
app.use('/api/users', userRoutes);      // Routes for user management
app.use('/api/courses', courseRoutes);  // Routes for courses
app.use('/api/quizzes', quizRoutes);    // Routes for quizzes
app.use('/api/chat', chatRoutes);       // Routes for chat functionality
app.use('/api/auth', authRoutes);       // Routes for authentication

// Protected user routes (make sure you only apply protect to routes that need it)
app.use('/api/users/profile', protect, userRoutes);  // Ensure this applies to specific routes

// Catch-all for invalid API routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
