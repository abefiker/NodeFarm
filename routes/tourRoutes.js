const express = require('express');
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')
const router = express.Router()


router.use('/:tourId/reviews', reviewRouter)

const { getTourStats, getMonthlyPlan } = require('../controllers/tourController');

router.route('/top-5-cheap').get(tourController.topAliasTour, tourController.getAllTour);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistance)
//tours-within/234/center/-40,40/unit/ml(km)

router.route('/')
    .get(tourController.getAllTour)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)


module.exports = router