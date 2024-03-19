const Captcha = require('../../models/api/Capcha');

module.exports = {
    createCaptcha: async (req, res) => {
        const { userId } = req.body;
        try {
            const captcha = Math.random().toString(36).substring(2, 8);
            const expirationTime = 5 * 60 * 1000;
            const expired_at = Date.now() + expirationTime;
            const newCaptcha = new Captcha({ code: captcha, userId: userId, expired_at: expired_at });
            await newCaptcha.save();
            res.json({ captcha, expired_at });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating CAPTCHA' });
        }
    },
    getCaptchaByUserId: async (req, res) => {
        const { userId } = req.params;
        try {
            const captcha = await Captcha.findOne({ userId: userId, used: false });
            if (captcha) {
                const remainingTime = captcha.expired_at - Date.now();
                res.json({ captcha: captcha.code, remainingTime });
            } else {
                throw new Error('CAPTCHA not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting CAPTCHA' });
        }
    },
    validateCaptcha: async (req, res) => {
        const { userId, captchaCode } = req.body;
        try {
            const captcha = await Captcha.findOne({ code: captchaCode, userId: userId, used: false });
            if (captcha) {
                captcha.used = true;
                await captcha.save();
                await Captcha.deleteOne({ _id: captcha._id });
                res.json({ message: 'CAPTCHA is valid' });
            } else {
                res.status(401).json({ error: 'Invalid CAPTCHA' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error validating CAPTCHA' });
        }
    },
    
};
