const router = require('express').Router()
const attemptController = require('../controllers/attempt.controller')



router.post('/submitAttempt', attemptController.submitQuiz)
router.post('/findAllPrevious', attemptController.getAllPreviousAttempts)
router.post('/findAllPrevious/quizID/:quizID', attemptController.getPreviousAttemptsByQuiz)

module.exports = router

