const mongoose = require('mongoose');

const WeeklyRankingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scoreWithinSevenDays: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('WeeklyRanking', WeeklyRankingSchema);
