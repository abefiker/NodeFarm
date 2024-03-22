const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name 😢'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration ��']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a maxGroupSize ��']
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty ��']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingQuality: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price 😢']
  },
  priceDisplay: Number,
  summary: {
    type: String,
    required: [true, 'A Tour must have a summary ��']
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A Tour must have a description"]
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have an imageCover ��']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select:false
  },
  startDates: [Date]
})
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;