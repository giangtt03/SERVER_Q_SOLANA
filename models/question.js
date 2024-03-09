const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  answers: [{
    content: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  }],
});

module.exports = mongoose.model('Question', QuestionSchema);
