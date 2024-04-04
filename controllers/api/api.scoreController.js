const Session = require('../../models/api/Session');
const UserScore = require('../../models/api/UserScore');

module.exports = {
    getUserTotalScore: async (userId) => {
        try {
            let totalScoreFromSessions = 0;
            const sessionScores = new Set(); 
            const userSessions = await Session.find({ userId: userId });
            for (const session of userSessions) {
                if (!sessionScores.has(session.quizId)) {
                    totalScoreFromSessions += session.score;
                    sessionScores.add(session.quizId); 
                }
            }
    
    
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