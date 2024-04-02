// Import các model cần thiết
const Session = require('../../models/api/Session');
const UserScore = require('../../models/api/UserScore');

module.exports = {
    getUserTotalScore: async (userId) => {
        try {
            let totalScoreFromSessions = 0;
            const userSessions = await Session.find({ userId: userId });
            userSessions.forEach(session => {
                totalScoreFromSessions += session.score;
            });

            const userScore = await UserScore.findOne({ userId });
            const totalScoreFromUserScore = userScore ? userScore.totalScore : 0;

            const totalScore = totalScoreFromSessions + totalScoreFromUserScore;

            return totalScore;
        } catch (error) {
            console.error("Error getting user total score:", error);
            throw error;
        }
    },

    updateUserScoreAfterNFTExchange: async (userId, scoreToSubtract) => {
        try {
            let userScore = await UserScore.findOne({ userId });
            if (!userScore) {
                userScore = new UserScore({
                    userId: userId,
                    totalScore: 0
                });
            }

            userScore.totalScore -= scoreToSubtract;
            await userScore.save();
        } catch (error) {
            console.error("Error updating user score after NFT exchange:", error);
            throw error;
        }
    }
};
