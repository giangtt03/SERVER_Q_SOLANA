const express = require('express');
const router = express.Router();
const userScoreController = require('../../controllers/api/api.scoreController');
const UserScore = require('../../models/api/UserScore');

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const totalScore = await userScoreController.getUserTotalScore(userId);
        // console.log("totalScore: ", totalScore);
        
        res.json({ userId: userId, totalScore: totalScore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
