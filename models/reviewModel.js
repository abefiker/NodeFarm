const mongoose = require('mongoose');

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
    this.populate({
        path: 'user',
        select: 'name'
    }).populate({
        path: 'tour',
        select: 'name photo'
    })
    next()
})
const Review = mongoose.model('Review', reviewSchema)
module.exports = Review