const Test = require('../../models/Test');
const Question = require('../../models/question');
const Category = require('../../models/Category');
const User = require('../../models/api/User');
const Session = require('../../models/api/Session');
const UserScore = require('../../models/api/UserScore');
const apiRankController = require('./api.rankController');

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

            // Tìm bài kiểm tra theo ID và populate danh sách câu hỏi
            const test = await Test.findById(testId).populate({
                path: 'questions',
                populate: {
                    path: 'answers' // Populate danh sách câu trả lời
                }
            });

            // console.log("Test detail:", test);

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
            // console.log("Received userId in takeTest:", userId);
    
            const test = await Test.findById(testId).populate('questions');
            // console.log("Test found:", test);
    
            if (!test) {
                console.error("Test not found");
                return res.status(404).json({ error: 'Test not found' });
            }
    
    
            if (test.questions.length !== answers.length) {
                console.error("Number of answers does not match number of questions");
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
                    test.questions[index].isCorrect = true;
                } else {
                    incorrectCount++;
                    score -= 5;
                    test.questions[index].isCorrect = false;
                }
            }
    
            // console.log("Score:", score);
            // console.log("Correct answers count:", correctCount);
            // console.log("Incorrect answers count:", incorrectCount);
    
            const sessionAnswers = answers.map((answer, index) => {
                const question = test.questions[index];
                const correctAnswer = question.answers.find(ans => ans.correct.toLowerCase() === 'true');
                return {
                    questionId: question._id,
                    selectedAnswerIndex: index,
                    isCorrect: correctAnswer.answer === answers[index] 
                };
            });
    
            await test.save();
    
            console.log("Data for Session.create:", {
                userId: userId,
                testId: testId,
                answers: sessionAnswers,
                score: score,
                correctAnswersCount: correctCount,
                incorrectAnswersCount: incorrectCount,
            });
    
            const session = await Session.create({
                userId: userId,
                testId: testId,
                answers: sessionAnswers,
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
    
            await apiRankController.updateRankingOnTestCompletion(userId, score);
    
            res.status(200).json({ message: 'Test completed', user: updatedUser, session });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: error.message });
        }
    },
    
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

    getSessionsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            // console.log("UserID:", userId);

            const sessions = await Session.find({ userId })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate({
                    path: 'testId',
                    select: 'name image questions',
                    populate: {
                        path: 'questions',
                        populate: {
                            path: 'answers'
                        }
                    }
                })
            // console.log("Sessions found:", sessions);

            if (!sessions) {
                // console.log("Sessions not found for user:", userId);
                return res.status(404).json({ error: 'Sessions not found for this user' });
            }

            res.json(sessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            res.status(500).json({ message: error.message });
        }
    }
};
