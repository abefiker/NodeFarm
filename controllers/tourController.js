const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatires = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.topAliasTour = (req, res, next) => {
    console.log("req.query before defaults:", req.query); // Log initial query
    req.query.limit = req.query.limit || '5';
    req.query.sort = req.query.sort || '-ratingsAverage,price';
    req.query.fields = req.query.fields || 'name,description,duration,price,difficulty';
    console.log("req.query after defaults:", req.query); // Log modified query
    next();
};

exports.getAllTour = catchAsync(async (req, res, next) => {
    const features = new APIFeatires(Tour.find(), req.query)
        .filter()
        .sorted()
        .limiting()
        .pagination()
    const tours = await features.query
    res.status(200).json({
        status: 'success',
        requistedAt: req.requestTime,
        result: tours.length,
        data: {
            tours
        }
    })
})
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ _id: req.params.id }).populate('reviews')
    if (!tour) {
        return next(new AppError('No tour found with this ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
})
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
    if (!tour) {
        return next(new AppError('No tour found with this ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
})
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndRemove(req.params.id)
    if (!tour) {
        return next(new AppError('No tour found with this ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: {
            tour: null
        }
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
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
})
//the following function implement the real life business logic
//that want the busiest month that a lot of tours registered in the given year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
})
