const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (req, res) => {
    try {
      const { username, email, password, avatar, solanaAddress, role } = req.body;

      // Mã hóa mật khẩu
      const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.SECRET).toString();

      const newUser = new User({
        username,
        email,
        password: encryptedPassword,
        avatar,
        solanaAddress,
        role,
      });

      const savedUser = await newUser.save();
      // Trả về thông tin người dùng đã lưu (không bao gồm mật khẩu)
      res.json({ savedUser: { ...savedUser._doc, password: undefined } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
        if (req.method === "GET") {
            // Nếu là GET request, chỉ render trang đăng nhập
            return res.render('login');
        }

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

        // Lưu thông tin người dùng và token vào session
        req.session.user = user;
        req.session.token = token;

        // Trả về thông tin người dùng và token
        res.render('menu', { user: user});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

};
