const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
  loginUser: async (req, res) => {
    try {
        // Lấy email và mật khẩu từ req.body
        const { email, password } = req.body;

        // Tìm kiếm người dùng trong cơ sở dữ liệu bằng email
        const user = await User.findOne({ email });

        // Kiểm tra nếu không tìm thấy người dùng
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Kiểm tra mật khẩu
        const bytes = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
        const originalPassword = bytes.toString(CryptoJs.enc.Utf8);

        if (originalPassword !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Tạo và gửi token khi đăng nhập thành công
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SEC, { expiresIn: '1h' });

        // Trả về thông tin người dùng và token
        res.json({ user: user, token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


};