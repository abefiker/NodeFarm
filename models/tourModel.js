const mongoose = require('mongoose')
const slugify = require('slugify')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name 😢'],
    unique: true
  },
  slug: String,
  secretTour: {
    type: String,
    default: false
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

//QUERY MIDDLEWARE 
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start= Date.now()
  next()
})
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start}  milliseconds`)
    next()
})
tourSchema.pre('aggregate',function(next){
    console.log(this.pipeline())
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;