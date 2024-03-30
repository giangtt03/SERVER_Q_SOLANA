const TKNguoiDung = require('../../models/api/User');
const Capcha = require('../../models/api/Capcha');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
    createTK: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const encryptedPassword = CryptoJs.AES.encrypt(password, process.env.SECRET).toString();

            const newUser = new TKNguoiDung({
                username,
                email,
                password: encryptedPassword
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

            const bytes = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
            const originalPassword = bytes.toString(CryptoJs.enc.Utf8);

            if (originalPassword !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SEC, { expiresIn: '1h' });

            res.json({ user: user, token: token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { userId, oldPassword, newPassword, confirmPassword } = req.body;

            const user = await TKNguoiDung.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const bytes = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
            const originalPassword = bytes.toString(CryptoJs.enc.Utf8);

            if (oldPassword !== originalPassword) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: 'New password and confirm password do not match' });
            }

            const encryptedNewPassword = CryptoJs.AES.encrypt(newPassword, process.env.SECRET).toString();
            user.password = encryptedNewPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    verifyPassword: async (req, res) => {
        try {
            const { userId, password } = req.body;
    
            console.log("Received userId:", userId);
            console.log("Received password:", password);
    
            const user = await TKNguoiDung.findById(userId);
    
            if (!user) {
                console.log("User not found:", userId);
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }
    
            const dbBytes = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
            const originalPassword = dbBytes.toString(CryptoJs.enc.Utf8);
    
            console.log("Original password from database:", originalPassword);
    
            // So sánh mật khẩu đã giải mã từ cơ sở dữ liệu với mật khẩu gửi từ client
            if (password !== originalPassword) {
                console.log("Password mismatch!");
                return res.status(401).json({ success: false, error: 'Mật khẩu không đúng' });
            }
    
            console.log("Password verification successful!");
            res.json({ success: true, message: 'Xác thực mật khẩu thành công' });
        } catch (error) {
            console.error("Error in verifyPassword controller:", error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }
    },
    changeEmail: async (req, res) => {
        try {
            const { userId, newEmail } = req.body;

            const user = await TKNguoiDung.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.email = newEmail;
            await user.save();

            res.json({ message: 'Email updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateAddressUser: async (req, res) => {
        try {
        const { solanaAddress, userId } = req.body;
        if (!(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
        }
        console.log("log dia chi",solanaAddress);

        const user = await TKNguoiDung.findByIdAndUpdate(
        userId,{ solanaAddress },{ new: true }
        );
        
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
  },
};