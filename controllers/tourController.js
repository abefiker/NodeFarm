const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatires = require('../utils/apiFeatures');


exports.topAliasTour = (req, res, next) => {
    console.log("req.query before defaults:", req.query); // Log initial query
    req.query.limit = req.query.limit || '5';
    req.query.sort = req.query.sort || '-ratingsAverage,price';
    req.query.fields = req.query.fields || 'name,description,duration,price,difficulty';
    console.log("req.query after defaults:", req.query); // Log modified query
    next();
};

exports.getAllTour = async (req, res) => {
    try {
        //excute the query
        const features = new APIFeatires(Tour.find(), req.query).filter().sorted().limiting().pagination()
        const tours = await features.query

        //send responce
        res.status(200).json({
            status: 'success',
            requistedAt: req.requestTime,
            result: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'Server error while reading data ...😢🥹'
        })
    }
}
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error
        })
    }
}
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error
        })
    }
}
exports.deleteTour = async (req, res) => {
    await Tour.findByIdAndRemove(req.params.id)
    try {
        res.status(204).json({
            status: 'success',
            data: {
                tour: null
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: { $gte: 4.5 }
                }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingQuality' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY'} }
            // }
        ]);

        res.status(200).json({
            status: 'Success',
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message // Display error message
        });
    }
}
//the following function implement the real life business logic
//that want the busiest month that a lot of tours registered in the given year
exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(year, 0, 1),
                        $lte: new Date(year + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTours: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: { _id: 0 }
            },
            {
                $sort: { numTours: -1 }
            },
            {
                $limit: 1
            }
        ])
        res.status(200).json({
            stattus: 'Success',
            plan
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error.message // Display error message
        });
    }
} 