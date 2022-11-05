const router = require('express').Router()
const userController = require('../controllers/user.controller')


router.get('/getAll', userController.getAll)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/verifyEmail/:confCode', userController.verifyEmail)


module.exports = router