const express = require('express');
const router = express.Router();
const helpController = require('../../controllers/api/api.helpController');

router.post('/', helpController.createHelp);
router.get('/', helpController.getAllHelps);
router.get('/:id', helpController.getHelpById);

module.exports = router;
