const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware kiểm tra xem người dùng đã đăng nhập hay chưa
const sessionMiddleware = async (req, res, next) => {
  try {
    // Kiểm tra xem session có chứa thông tin người dùng không
    if (req.session && req.session.user) {
      // Nếu có, gọi next để tiếp tục xử lý yêu cầu
      next();
    } else {
      // Nếu không, kiểm tra xem có token được gửi từ client không
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Giải mã token để lấy thông tin người dùng
      const decoded = jwt.verify(token, process.env.JWT_SEC);

      // Tìm kiếm người dùng trong cơ sở dữ liệu bằng userId từ token
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Lưu thông tin người dùng vào session
      req.session.user = user;

      // Gọi next để tiếp tục xử lý yêu cầu
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = sessionMiddleware;
