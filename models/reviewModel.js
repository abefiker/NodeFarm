const mongoose = require('mongoose');
const Tour = require('./tourModel')
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must have a review 😢'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to user']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to tour']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

)
reviewSchema.pre(/^find/, function (next) {
    //     // this.populate({
    //     //     path: 'user',
    //     //     select: 'name'
    //     // }).populate({
    //     //     path: 'tour',
    //     //     select: 'name photo'
    //     // })
    this.populate({
        path: 'user',
        select: 'name'
    })
    //     this.populate({
    //         path: 'tour',
    //         select: 'name photo'
    //     })
    next()
})

reviewSchema.statics.calcuAvarageRatings = async function (tourId) {
    try {
        const stats = await this.aggregate([
            {
                $match: { tour: tourId }
            },
            {
                $group: {
                    _id: '$tour',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length > 0) {
            await Tour.findByIdAndUpdate(tourId, {
                ratingsQuantity: stats[0].nRating,
                ratingsAverage: stats[0].avgRating
            });
        } else {
            // Reset to defaults if no reviews are found
            await Tour.findByIdAndUpdate(tourId, {
                ratingsQuantity: 0,
                ratingsAverage: 4.5 // Assuming 4.5 is a sensible default
            });
        }
    } catch (error) {
        console.error('Failed to calculate average ratings', error);
        // Handle the error appropriately
    }
};

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.constructor.calcuAvarageRatings(this.r.tour)
})
reviewSchema.post('save', function () {
    //this point to the current review
    this.constructor.calcuAvarageRatings(this.tour)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review