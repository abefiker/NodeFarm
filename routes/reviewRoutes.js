const express = require('express');
const router = express.Router({ mergeParams: true })
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController');
router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setUserAndTourIds,
        reviewController.createReview
    )
router.route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)
module.exports = router