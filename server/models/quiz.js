const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Add this line
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
  }],
});

module.exports = mongoose.model('Quiz', quizSchema);
