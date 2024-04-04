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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })
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
            { $match: { tour: tourId } },
            {
                $group: {
                    _id: '$tour',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        if (stats.length === 0) {
            // Handle no reviews found
            console.log("No reviews found for this tour.");
            await Tour.findByIdAndUpdate(tourId, {
                ratingQuantity: 0, // Set default if no reviews
                ratingsAverage: 4.5  // Or another sensible default
            });
            return;
        }

        // Ensure stats[0] is defined before accessing properties
        if (!stats[0]) {
            console.error("Unexpected error: stats array is empty.");
            return; // Or handle it differently
        }

        console.log(stats);
        await Tour.findByIdAndUpdate(tourId, {
            ratingQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } catch (err) {
        console.error("Error calculating average ratings:", err);
    }
};


reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    // console.log(this.r)
    next()
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcuAvarageRatings(this.r.tour)
})


const Review = mongoose.model('Review', reviewSchema)
module.exports = Review