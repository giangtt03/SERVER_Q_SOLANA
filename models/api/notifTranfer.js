const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifTranfersSchema = new Schema({
    uId: { type: String, required: true },
    userId: { type: String, required: true },
    nftId: { type: String, required: true },
    requestTime: { type: Date, default: Date.now },
    confirmed: { type: Boolean, default: false }
});

const NotifTranfers = mongoose.model('NotifTranfers', notifTranfersSchema);

module.exports = NotifTranfers;
