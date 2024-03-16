const express = require('express');
const router = express.Router();
const rank = require('../../controllers/api/api.rankController');

router.get('/weekly', rank.getWeeklyRankings);

module.exports = router;
