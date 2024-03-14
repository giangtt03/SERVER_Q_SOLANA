const Test = require('../../models/Test');
const Question = require('../../models/question');
const Category = require('../../models/Category');
const User = require('../../models/api/User');
const Session = require('../../models/api/Session');
const UserScore = require('../../models/api/UserScore');

module.exports = {
    getTests: async (req, res) => {
        try {
            const tests = await Test.find({});
            res.json(tests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getTestById: async (req, res) => {
        try {
            const { testId } = req.params;

            const test = await Test.findById(testId);
            
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }
            
            res.json(test);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    takeTest: async (req, res) => {
        try {
            const { testId, userId, answers } = req.body;

            const test = await Test.findById(testId).populate('questions');

            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }

            if (test.questions.length !== answers.length) {
                return res.status(400).json({ error: 'Number of answers does not match number of questions' });
            }

            let score = 0;
            let correctCount = 0;
            let incorrectCount = 0;

            for (let index = 0; index < answers.length; index++) {
                const userAnswer = answers[index];
                const question = test.questions[index];
                const correctAnswer = question.answers.find(answer => answer.answer === userAnswer && answer.correct.toLowerCase() === 'true');

                if (typeof correctAnswer !== 'undefined') {
                    correctCount++;
                    score += 10;
                    test.questions[index].isCorrect = true; // Mark question as correct
                } else {
                    incorrectCount++;
                    score -= 5;
                    test.questions[index].isCorrect = false; // Mark question as incorrect
                }
            }

            // Save the updated test with correct/incorrect marks
            await test.save();

            const session = await Session.create({
                userId: userId,
                testId: testId,
                answers: answers.map((answer, index) => ({
                    questionId: test.questions[index]._id,
                    selectedAnswerIndex: index,
                })),
                score: score,
                correctAnswersCount: correctCount,
                incorrectAnswersCount: incorrectCount,
            });

            const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { score: score } }, { new: true });

            let userScore = await UserScore.findOne({ userId: userId });
            if (!userScore) {
                userScore = new UserScore({
                    userId: userId,
                    totalScore: 0
                });
            }
            
            userScore.totalScore += score;

            await userScore.save();

            // Send the response back to the client
            res.status(200).json({ message: 'Test completed', user: updatedUser, session });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: error.message });
        }
    }

    // Hiển thị bài quizz được làm nhiều nhất
    // getMostTakenTests: async (req, res) => {
    //     try {
    //         const tests = await Test.aggregate([
    //             {
    //                 $lookup: {
    //                     from: 'sessions',
    //                     localField: '_id',
    //                     foreignField: 'testId',
    //                     as: 'sessions'
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     name: 1,
    //                     category: 1,
    //                     questions: 1,
    //                     count: { $size: '$sessions' }
    //                 }
    //             },
    //             { $sort: { count: -1 } },
    //             { $limit: 7 } // Giới hạn số lượng bài quizz hiển thị
    //         ]);
    //         res.json(tests);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }, 
    
};
