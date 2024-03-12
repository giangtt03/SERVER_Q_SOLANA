const express = require('express');
const router = express.Router();
const userScoreController = require('../../controllers/api/api.scoreController');
const UserScore = require('../../models/api/UserScore');

// Route để lấy tổng điểm của người dùng
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const totalScore = await userScoreController.getUserTotalScore(userId);
        
        // Tạo một bản ghi mới trong bảng UserScore với thông tin về userId và totalScore
        const newUserScore = new UserScore({ userId: userId, totalScore: totalScore });
        await newUserScore.save();

        res.json({ userId: userId, totalScore: totalScore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
