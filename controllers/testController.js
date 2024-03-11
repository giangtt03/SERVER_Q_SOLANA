const Test = require('../models/Test');

module.exports = {
    createTest: async (req, res) => {
        try {
            const { name, category, questions } = req.body;
            const newTest = new Test({
                name,
                category,
                questions,
            });
            const savedTest = await newTest.save();
            res.json(savedTest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTestById: async (req, res) => {
        try {
            const { id } = req.params;
            const test = await Test.findById(id).populate('questions');
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }
            res.json(test);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllTests: async (req, res) => {
        try {
            const tests = await Test.find().populate('category');
            res.json(tests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTest: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, questions } = req.body;
            const updatedTest = await Test.findByIdAndUpdate(
                id,
                { name, category, questions },
                { new: true }
            ).populate('questions');
            if (!updatedTest) {
                return res.status(404).json({ message: 'Test not found' });
            }
            res.json(updatedTest);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTest: async (req, res) => {
        try {
            const { id } = req.params;
            await Test.findByIdAndDelete(id);
            res.json({ message: 'Test deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
