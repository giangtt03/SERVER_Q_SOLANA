const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            console.log('Token is missing');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = req.headers.authorization.split(' ')[1]; 
        console.log('Token:', token); 
        if (!token) {
            console.log('Token is missing');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
