const router = require('express').Router()
const attemptController = require('../controllers/attempt.controller')



router.post('/submitAttempt', attemptController.submitQuiz)

module.exports = router

