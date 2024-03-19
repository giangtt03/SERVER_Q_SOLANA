const mongoose = require('mongoose');

const CaptchaSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    expired_at: {
        type: Date,
        default: () => Date.now() + 5 * 60 * 1000, 
    },
    used: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Captcha', CaptchaSchema);
