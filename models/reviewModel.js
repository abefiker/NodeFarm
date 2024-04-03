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
reviewSchema.static.CalcuAvarageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            },
            $group: {
                __id: tourId,
                nRating: { $sum: 1 },
                avgrating: { $avg: '$rating' }
            }
        }
    ])
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgrating
    })
}
reviewSchema.post('save', function () {
    this.constructor.CalcuAvarageRating(this.tour)
})
const Review = mongoose.model('Review', reviewSchema)
module.exports = Review