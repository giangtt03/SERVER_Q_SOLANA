const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

// Middleware để kiểm tra session
router.use(sessionMiddleware);

router.get('/update/:id', questionController.getUpdateQuestionForm);
router.put('/update/:id', questionController.updateQuestion);

router.get('/create', questionController.getCreateQuestionForm);
router.post('/create', questionController.createQuestion);

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);

router.delete('/delete/:id', questionController.deleteQuestion);

module.exports = router;
