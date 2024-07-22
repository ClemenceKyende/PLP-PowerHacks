const mongoose = require('mongoose');

// Define the lesson schema
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true // Make sure content is always provided
  },
  resources: {
    type: [String], // Array of strings (URLs or file paths)
    default: [] // Default to an empty array if no resources are provided
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Define the course schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lessons: {
    type: [lessonSchema], // Array of lesson subdocuments
    default: [] // Default to an empty array if no lessons are provided
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
