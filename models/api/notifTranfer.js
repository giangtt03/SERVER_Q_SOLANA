const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifTranfersSchema = new Schema({
    userId: { type: String, required: true },
    nftId: { type: String, required: true },
    requestTime: { type: Date, default: Date.now }
});

const NotifTranfers = mongoose.model('NotifTranfers', notifTranfersSchema);

module.exports = NotifTranfers;
