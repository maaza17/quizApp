const router = require('express').Router()
const quizController = require('../controllers/quiz.controller')

router.post('/createQuiz', quizController.createQuiz)
router.post('/listAllQuizzes', quizController.listAllQuizzes)
router.post('/listQuizzesByTopic', quizController.listQuizzesByTopic)
router.post('/getOneQuiz', quizController.getOneQuiz)

module.exports = router