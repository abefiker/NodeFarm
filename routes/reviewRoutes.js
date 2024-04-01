const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController');
router.route('/').post(authController.protect, reviewController.createReview)
    .get(authController.protect, authController.restrictTo('user'), reviewController.getAllReviews)

module.exports = router