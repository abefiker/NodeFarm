const express = require('express');
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')
const router = express.Router()

// router.param('id',tourController.checkID)
const { getTourStats, getMonthlyPlan } = require('../controllers/tourController');

router.route('/top-5-cheap').get(tourController.topAliasTour, tourController.getAllTour);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(authController.protect, tourController.getAllTour).post(tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour)

module.exports = router