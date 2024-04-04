const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

exports.topAliasTour = (req, res, next) => {
    console.log("req.query before defaults:", req.query); // Log initial query
    req.query.limit = req.query.limit || '5';
    req.query.sort = req.query.sort || '-ratingsAverage,price';
    req.query.fields = req.query.fields || 'name,description,duration,price,difficulty';
    console.log("req.query after defaults:", req.query); // Log modified query
    next();
};

exports.getAllTour = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)



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

// /tours-within/:distance/center/:latlng/unit/:unit
//tours-within/234/center/34.455432,-118.462725/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in lat,lng format', 400))
    }
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    console.log(distance, lat, lng, unit)
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            data: tours
        }
    })
})

exports.getDistance = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001
    if (!lat || !lng) {
        next(new AppError('please provide latitude and longitude in lat,lng format', 400))
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: "success",
        data: {
            data: distances
        }
    })
})