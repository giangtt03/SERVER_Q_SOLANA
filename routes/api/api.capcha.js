const express = require('express');
const router = express.Router();
const capcha = require('../../controllers/api/api.capchaController');

router.post('/create', capcha.createCaptcha);

router.get('/get/:userId', capcha.getCaptchaByUserId);

router.post('/validate', capcha.validateCaptcha);

module.exports = router;
