const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: { type: String, required: true },
    response: { type: String },
    type: { type: String, enum: ['question', 'feedback'], required: true },
    userId: { type: String, required: true }, // Store the user ID to link messages to users
    context: { type: String }, // Optional field for context, e.g., 'in lesson', 'in quiz'
    createdAt: { type: Date, default: Date.now }
});

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
