const mongoose = require('mongoose')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name 😢'],
    unique: true
  },
  slug: String,
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
  ratingQuantity: {
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
    select: false
  },
  startDates: [Date]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

//DOCUMENT MIDDLEWARE : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})
// tourSchema.pre('save', function (next) {
//   console.log('Will save document')
//   next()
// })
// tourSchema.post('save', function (doc, next) {
//   console.log(doc)
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;