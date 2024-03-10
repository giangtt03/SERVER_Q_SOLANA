const Question = require('../models/question');
const Category = require('../models/Category');

module.exports = {
  getCreateQuestionForm: async (req, res) => {
    try {
      const categories = await Category.find();
      const user = req.session.user;
      res.render('question/createQuestion', { categories, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const { content, category, answers } = req.body;
      const newQuestion = new Question({
        content,
        category,
        answers,
      });
      const savedQuestion = await newQuestion.save();
      res.json(savedQuestion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUpdateQuestionForm: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findById(id);
      const categories = await Category.find();
      const user = req.session.user;
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.render('question/updateQuestion', { question, categories, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { content, category, answers } = req.body;
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { content, category, answers },
        { new: true }
      );
      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
      res.json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      await Question.findByIdAndDelete(id);
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getQuestionById: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find();
      const user = req.session.user;
      res.render('question/getAllQuestions', { questions, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
