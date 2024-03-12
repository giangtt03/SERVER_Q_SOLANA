const TKNguoiDung = require('../../models/api/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
    createTK: async (req, res) => {
        try {
            const { username, email, password, avatar, solanaAddress } = req.body;

            // Mã hóa mật khẩu
            const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.SECRET).toString();

            const newUser = new TKNguoiDung({
                username,
                email,
                password: encryptedPassword,
                avatar,
                solanaAddress,
            });

            const savedUser = await newUser.save();
            res.json({ savedUser: { ...savedUser._doc, password: undefined } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    loginTK: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await TKNguoiDung.findOne({ email });

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
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC, { expiresIn: '1h' });

            res.json({ user: user, token: token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};