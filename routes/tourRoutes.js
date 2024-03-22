const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router()

// router.param('id',tourController.checkID)
const { getTourStats } = require('../controllers/tourController');

router.route('/top-5-cheap').get(tourController.topAliasTour, tourController.getAllTour);
router.route('/tour-stats').get(getTourStats);
router.route('/').get(tourController.getAllTour).post(tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)
module.exports = router