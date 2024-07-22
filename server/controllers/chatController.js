const OpenAI = require('openai');
const Chat = require('../models/chat'); // Ensure this path is correct

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Handle chat requests (questions and feedback)
exports.handleChat = async (req, res) => {
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
            // Handle chat (question)
            const aiResponse = await openai.completions.create({
                model: 'gpt-3.5-turbo', // Update to the correct model if necessary
                prompt: message,
                max_tokens: 150
            });

            const responseText = aiResponse.choices[0].text.trim();

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
