const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  // These options are no longer necessary but included for backward compatibility
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit the process with failure code
    }
};

module.exports = connectDB;
