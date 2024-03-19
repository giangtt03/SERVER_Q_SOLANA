const express = require('express');
const router = express.Router();
const api = require('../../controllers/api/api.authController');

router.post('/create-user', api.createTK);

router.post('/login', api.loginTK);

router.post('/change-password', api.changePassword);

router.post('/veryfy-password', api.verifyPassword);

router.post('/change-email', api.changeEmail);


module.exports = router;
