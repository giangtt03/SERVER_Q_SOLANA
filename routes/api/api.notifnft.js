const express = require('express');
const router = express.Router();
const NotifTranfers = require('../../models/api/notifTranfer');
const User = require('../../models/api/User');
const UserScore = require('../../models/api/UserScore');
const userScoreController = require('../../controllers/api/api.scoreController');

router.post('/exchangeNFT', async (req, res) => {
    const { userId, nftId, requestTime } = req.body;

    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        const uScore = await UserScore.findOne({ userId }); 
        if (!uScore || uScore.totalScore < 200) {
            return res.status(400).json({ success: false, message: 'Bạn không đủ điểm để đổi NFT' });
        }

        const walletId = user.solanaAddress;
        const notification = new NotifTranfers({
            uId: userId,
            userId: walletId,
            nftId,
            requestTime
        });
        await notification.save();

        // const existingRequest = await NotifTranfers.findOne({ uId: userId, nftId });
        // if (existingRequest) {
        //     return res.status(400).json({ success: false, message: 'Bạn đã gửi yêu cầu đổi NFT trước đó' });
        // }

        const scoreToSubtract = 200;
        await userScoreController.updateUserScoreAfterNFTExchange(userId, scoreToSubtract);

        return res.status(200).json({ success: true, message: 'Yêu cầu đổi NFT đã được gửi thành công' });
    } catch (error) {
        console.error("Lỗi khi lưu yêu cầu đổi NFT:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/confirm', async (req, res) => {
    try {
        const user = req.session.user;
        const exchangeRequests = await NotifTranfers.find({ confirmed: false });

        res.render('c&n/exchangeRequests', { exchangeRequests, user });
    } catch (error) {
        console.error("Error fetching exchange requests:", error);
        res.status(500).send("Error fetching exchange requests");
    }
});

router.post('/confirmExchange', async (req, res) => {
    const { requestId } = req.body;

    try {
        const notification = await NotifTranfers.findById(requestId);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Yêu cầu không tồn tại' });
        }

        notification.confirmed = true;
        await notification.save();

        return res.status(200).json({ success: true, message: 'Xác nhận thành công' });
    } catch (error) {
        console.error("Lỗi khi xác nhận yêu cầu đổi NFT:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/confirmH', async (req, res) => {
    try {
        const user = req.session.user;
        const confirmedRequests = await NotifTranfers.find({ confirmed: true });
        res.render('c&n/confirmH', { confirmedRequests, user });
    } catch (error) {
        console.error("Error fetching confirmed exchange requests:", error);
        res.status(500).send("Error fetching confirmed exchange requests");
    }
});


module.exports = router;
