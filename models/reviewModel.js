const mongoose = require('mongoose');
const Schema = new mongoose.Schema

const reviewSchema = new Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to user']
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to tour']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true}
    }

)

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review