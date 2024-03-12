const mongoose = require('mongoose');

const UserScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('UserScore', UserScoreSchema);