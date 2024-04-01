const express = require('express');
const router = express.Router();
const NotifTranfers = require('../../models/api/notifTranfer');
const User = require('../../models/api/User');
const UserScore = require('../../models/api/UserScore');

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

        const userScore = await UserScore.findOne({ userId }); 
        if (userScore) {
            userScore.totalScore -= 200; 
            await userScore.save();
        }

        return res.status(200).json({ success: true, message: 'Yêu cầu đổi NFT đã được gửi thành công' });
    } catch (error) {
        console.error("Lỗi khi lưu yêu cầu đổi NFT:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/confirm', async (req, res) => {
    try {
        const exchangeRequests = await NotifTranfers.find(); 


        res.render('c&n/exchangeRequests', { exchangeRequests });
    } catch (error) {
        console.error("Error fetching exchange requests:", error);
        res.status(500).send("Error fetching exchange requests");
    }
});


module.exports = router;
