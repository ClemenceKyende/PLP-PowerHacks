const OpenAI = require('openai');
const Chat = require('../models/chat'); // Ensure this path is correct

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Predefined responses
const predefinedResponses = {
    'hello': 'Hello! How can I assist you today?',
    'hi': 'Hi there! What can I do for you?',
    'hey': 'Hey! How can I help you?',
    'good morning': 'Good morning! How can I assist you?',
    'good afternoon': 'Good afternoon! How can I help you?',
    'good evening': 'Good evening! What can I do for you?',
    // Add more predefined responses as needed
};

// Handle chat requests (questions and feedback)
const handleChat = async (req, res) => {
    try {
        const { message, type } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (type === 'feedback') {
            await handleFeedback(message); // Handle feedback asynchronously
            // Save feedback to the database
            await Chat.create({ message, type });
            return res.json({ message: 'Feedback received successfully' });
        } else if (type === 'question') {
            const lowerCaseMessage = message.toLowerCase();

            // Check if there is a predefined response
            if (predefinedResponses[lowerCaseMessage]) {
                const responseText = predefinedResponses[lowerCaseMessage];

                // Save chat history to the database
                await Chat.create({ message, response: responseText, type: 'question' });

                return res.json({ response: responseText });
            }

            // Handle chat (question) with OpenAI API
            const aiResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo', // Update to the correct model if necessary
                messages: [{ role: 'user', content: message }],
                max_tokens: 150
            });

            const responseText = aiResponse.choices[0].message.content.trim();

            // Save chat history to the database
            await Chat.create({ message, response: responseText, type: 'question' });

            return res.json({ response: responseText });
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }
    } catch (error) {
        console.error('Error handling chat or feedback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle feedback submissions
const handleFeedback = async (feedback) => {
    console.log('Feedback received:', feedback);
    // Add logic to save feedback if necessary
};

// Export the handleChat function
module.exports = { handleChat };
