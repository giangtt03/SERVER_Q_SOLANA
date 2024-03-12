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
    
    takeTest: async (req, res) => {
        try {
            const { testId, userId, answers } = req.body;

            // console.log("Data received from client:", req.body);

            const test = await Test.findById(testId).populate('questions');

            // console.log("Test details:", test);

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

                // console.log("User answer:", userAnswer);

                const question = test.questions[index];

                console.log("Question details:", question);

                const correctAnswer = question.answers.find(answer => answer.answer === userAnswer && answer.correct.toLowerCase() === 'true');

                // console.log("Correct answer:", correctAnswer);

                if (typeof correctAnswer !== 'undefined') {
                    correctCount++;
                    score += 10;
                } else {
                    incorrectCount++;
                    score -= 5;
                }
            }

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

            // console.log("Session details:", session);

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

            // console.log("Total score:", userScore.totalScore);

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
