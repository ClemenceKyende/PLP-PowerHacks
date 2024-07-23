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
                resources: ["https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML"],
                completed: false
            },
            {
                title: "CSS Basics",
                content: "Understanding CSS and styling web pages.",
                resources: ["https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps"],
                completed: false
            },
            {
                title: "JavaScript Basics",
                content: "Introduction to JavaScript programming.",
                resources: ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps"],
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
                resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"],
                completed: false
            },
            {
                title: "Promises",
                content: "Learning about Promises and their usage.",
                resources: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"],
                completed: false
            },
            {
                title: "Async/Await",
                content: "Using async/await for asynchronous operations.",
                resources: ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await"],
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
                resources: ["https://www.w3schools.com/sql/"],
                completed: false
            },
            {
                title: "NoSQL Databases",
                content: "Understanding NoSQL databases and their use cases.",
                resources: ["https://www.mongodb.com/nosql-explained"],
                completed: false
            },
            {
                title: "Database Design",
                content: "Best practices for designing databases.",
                resources: ["https://www.geeksforgeeks.org/database-design/"],
                completed: false
            }
        ]
    }
];

const sampleQuizzes = [
    {
        title: 'HTML Basics Quiz',
        description: 'Test your knowledge of HTML basics with these questions.',
        courseId: '', // This will be set after inserting courses
        questions: [
            {
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
                answer: "Hyper Text Markup Language",
                explanation: "HTML stands for Hyper Text Markup Language, which is used to structure content on the web."
            },
            {
                question: "Which HTML element is used to specify a header for a document?",
                options: ["<head>", "<header>", "<h1>"],
                answer: "<header>",
                explanation: "The <header> element defines a header for a document or section, providing a more semantic structure."
            },
            {
                question: "True or False: The <p> tag is used to define paragraphs.",
                options: ["True", "False"],
                answer: "True",
                explanation: "The <p> tag is used to define paragraphs in HTML, which is essential for organizing text content."
            },
            {
                question: "What is the purpose of the <alt> attribute in an image tag?",
                options: ["To specify the image source", "To provide alternative text for screen readers", "To define image dimensions"],
                answer: "To provide alternative text for screen readers",
                explanation: "The <alt> attribute describes the content of an image, which is important for accessibility and SEO."
            }
        ]
    },
    {
        title: 'JavaScript Advanced Quiz',
        description: 'Test your knowledge of advanced JavaScript concepts with these questions.',
        courseId: '', // This will be set after inserting courses
        questions: [
            {
                question: "What is a closure in JavaScript?",
                options: ["A function having access to its own scope", "A function having access to the parent scope", "Both"],
                answer: "Both",
                explanation: "A closure is a feature where a function retains access to its lexical scope, including variables from the parent scope."
            },
            {
                question: "What is the purpose of async/await in JavaScript?",
                options: ["To make asynchronous code look synchronous", "To make synchronous code asynchronous", "To block the execution"],
                answer: "To make asynchronous code look synchronous",
                explanation: "Async/await simplifies writing asynchronous code by making it appear more like synchronous code, improving readability."
            },
            {
                question: "Which method is used to handle errors in Promises?",
                options: [".catch()", ".then()", ".finally()"],
                answer: ".catch()",
                explanation: ".catch() method is used to handle errors that occur during the execution of a Promise."
            },
            {
                question: "True or False: Closures can be used to create private variables.",
                options: ["True", "False"],
                answer: "True",
                explanation: "Closures can encapsulate private variables and methods, providing a form of data hiding and encapsulation."
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
