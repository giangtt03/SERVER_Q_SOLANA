const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
  textH: {
    type: String,
  }
});

module.exports = mongoose.model('Help', HelpSchema);
