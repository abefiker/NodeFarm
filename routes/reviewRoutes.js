const express = require('express');
const router = express.Router({ mergeParams: true })
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController');

router.use(authController.protect)
router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setUserAndTourIds,
        reviewController.createReview
    )
router.route('/:id')
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .get(reviewController.getReview)
module.exports = router