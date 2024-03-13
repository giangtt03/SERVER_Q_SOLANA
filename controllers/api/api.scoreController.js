const Session = require('../../models/api/Session');
const UserScore = require('../../models/api/UserScore');

module.exports = {
    // Lấy ra tổng điểm của người dùng từ các bài kiểm tra đã làm
    getUserTotalScore: async (userId) => {
        try {
            const userSessions = await Session.find({ userId: userId });

            // Tính tổng điểm từ các phiên làm bài
            let totalScore = 0;
            userSessions.forEach(session => {
                totalScore += session.score;
            });
            return totalScore;
        } catch (error) {
            console.error("Error getting user total score:", error);
            throw error;
        }
    }
};
