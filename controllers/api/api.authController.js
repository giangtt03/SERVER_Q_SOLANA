const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
  loginUser: async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

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

        res.json({ user: user, token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


};