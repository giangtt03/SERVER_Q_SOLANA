const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: ''
  },
  solanaAddress: {
    type: String,
    unique: true,
    default: ''
  },
});

module.exports = mongoose.model('TKNguoiDung', UserSchema);
