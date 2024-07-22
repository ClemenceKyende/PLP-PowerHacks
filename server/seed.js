require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const Course = require('./models/course');
const Quiz = require('./models/quiz');

// Replace this with your MongoDB URI
const mongoURI = process.env.MONGODB_URI;

const sampleCourses = [
    {
        title: "Introduction to Web Development",
        description: "Learn the basics of web development, including HTML, CSS, and JavaScript.",
        lessons: [
            {
                title: "HTML Basics",
                content: "Introduction to HTML, structure, and elements.",
                resources: ["http://example.com/html-basics"],
                completed: false
            },
            {
                title: "CSS Basics",
                content: "Understanding CSS and styling web pages.",
                resources: ["http://example.com/css-basics"],
                completed: false
            },
            {
                title: "JavaScript Basics",
                content: "Introduction to JavaScript programming.",
                resources: ["http://example.com/javascript-basics"],
                completed: false
            }
        ]
    },
    {
        title: "Advanced JavaScript",
        description: "Deep dive into JavaScript, covering advanced topics like closures, promises, and async/await.",
        lessons: [
            {
                title: "Closures",
                content: "Understanding closures in JavaScript.",
                resources: ["http://example.com/closures"],
                completed: false
            },
            {
                title: "Promises",
                content: "Learning about Promises and their usage.",
                resources: ["http://example.com/promises"],
                completed: false
            },
            {
                title: "Async/Await",
                content: "Using async/await for asynchronous operations.",
                resources: ["http://example.com/async-await"],
                completed: false
            }
        ]
    },
    {
        title: "Database Management",
        description: "Learn about different types of databases and how to manage them.",
        lessons: [
            {
                title: "SQL Databases",
                content: "Introduction to SQL databases and their management.",
                resources: ["http://example.com/sql-databases"],
                completed: false
            },
            {
                title: "NoSQL Databases",
                content: "Understanding NoSQL databases and their use cases.",
                resources: ["http://example.com/nosql-databases"],
                completed: false
            },
            {
                title: "Database Design",
                content: "Best practices for designing databases.",
                resources: ["http://example.com/database-design"],
                completed: false
            }
        ]
    }
];

const sampleQuizzes = [
    {
        title: 'HTML Basics Quiz',
        description: 'Test your knowledge of HTML basics', // Added description
        courseId: '', // This will be set after inserting courses
        questions: [
            {
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
                answer: "Hyper Text Markup Language"
            },
            {
                question: "Which HTML element is used to specify a header for a document?",
                options: ["<head>", "<header>", "<h1>"],
                answer: "<header>"
            }
        ]
    },
    {
        title: 'JavaScript Advanced Quiz',
        description: 'Test your knowledge of advanced JavaScript concepts', // Added description
        courseId: '', // This will be set after inserting courses
        questions: [
            {
                question: "What is a closure in JavaScript?",
                options: ["A function having access to its own scope", "A function having access to the parent scope", "Both"],
                answer: "Both"
            },
            {
                question: "What is the purpose of async/await in JavaScript?",
                options: ["To make asynchronous code look synchronous", "To make synchronous code asynchronous", "To block the execution"],
                answer: "To make asynchronous code look synchronous"
            }
        ]
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        // Remove existing data
        await Course.deleteMany({});
        await Quiz.deleteMany({});

        // Insert courses
        const insertedCourses = await Course.insertMany(sampleCourses);
        console.log('Courses inserted');

        // Update quizzes with actual course IDs
        sampleQuizzes[0].courseId = insertedCourses[0]._id;
        sampleQuizzes[1].courseId = insertedCourses[1]._id;

        // Insert quizzes
        await Quiz.insertMany(sampleQuizzes);
        console.log('Quizzes inserted');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seed function
seedDatabase();
