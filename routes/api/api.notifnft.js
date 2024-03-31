const express = require('express');
const router = express.Router();
const NotifTranfers = require('../../models/api/notifTranfer');
const User = require('../../models/api/User');

router.post('/exchangeNFT', async (req, res) => {
    const { userId, nftId, requestTime } = req.body;

    try {

        const user = await User.findById(userId);
        const walletId = user.solanaAddress;
        // Lưu thông tin yêu cầu vào cơ sở dữ liệu
        const notification = new NotifTranfers({
            userId: walletId,
            nftId,
            requestTime
        });
        await notification.save();

        // Trả về phản hồi thành công
        return res.status(200).json({ success: true, message: 'Yêu cầu đổi NFT đã được gửi thành công' });
    } catch (error) {
        console.error("Lỗi khi lưu yêu cầu đổi NFT:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/confirm', async (req, res) => {
    try {
        // Lấy danh sách yêu cầu đổi từ cơ sở dữ liệu
        const exchangeRequests = await NotifTranfers.find(); // Sử dụng hàm find để lấy danh sách yêu cầu đổi từ MongoDB


        // Render trang EJS và truyền mảng exchangeRequests vào
        res.render('c&n/exchangeRequests', { exchangeRequests });
    } catch (error) {
        console.error("Error fetching exchange requests:", error);
        // Xử lý lỗi khi không thể lấy được danh sách yêu cầu đổi
        res.status(500).send("Error fetching exchange requests");
    }
});


module.exports = router;
