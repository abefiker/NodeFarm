const express = require('express');
const tourController = require('../controllers/tourController')
<<<<<<< HEAD
const authController = require('../controllers/authController')
=======
>>>>>>> 9cc139ff9e3639151809ea873425fd8dac6e3270
const router = express.Router()

// router.param('id',tourController.checkID)
const { getTourStats,getMonthlyPlan } = require('../controllers/tourController');

router.route('/top-5-cheap').get(tourController.topAliasTour, tourController.getAllTour);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
<<<<<<< HEAD
router.route('/').get(authController.protect,tourController.getAllTour).post(tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)

=======
router.route('/').get(tourController.getAllTour).post(tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)
>>>>>>> 9cc139ff9e3639151809ea873425fd8dac6e3270
module.exports = router