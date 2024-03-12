const express = require('express');
const router = express.Router();
const testController = require('../../controllers/api/api.testController');

router.get('/testsByName', testController.getTests);

router.post('/takeTest', testController.takeTest);

router.get('/mostTakenTests', testController.getMostTakenTests);

module.exports = router;
