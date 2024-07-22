const OpenAI = require('openai');

// Function to initialize OpenAI client
function initializeAI() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

module.exports = initializeAI;
