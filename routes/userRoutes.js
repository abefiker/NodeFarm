const express = require('express');
const userController = require('../controllers/userController')
<<<<<<< HEAD
const authController = require('../controllers/authController');
const router = express.Router()
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.route('/').get(userController.getAllusers)
=======
const router = express.Router()

router.route('/').get(userController.getAllusers).post(userController.createUser)
>>>>>>> 9cc139ff9e3639151809ea873425fd8dac6e3270
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)
module.exports = router