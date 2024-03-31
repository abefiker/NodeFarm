const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name 😢'],
    unique: true,
    maxlength: [40, 'a Tour name must have less or equal than 40 characters'],
    minlenght: [10, 'a Tour name must have greater or equal than 10 characters']
    // validate: [validator.isAlpha, 'Tour name must only have alpha characters']
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
    required: [true, 'A Tour must have a difficulty ��'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either : easy , medium , difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price 😢']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        // 'this' only points to docs on NEW documente creation
        return value < this.price;
      },
      message: 'Discount price ({VALUE}) must be less than  regular price'
    },
  },
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
  startDates: [Date],
  startLocation: {
    //geoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  //location document properties
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ]
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
  this.start = Date.now()
  next()
})
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}  milliseconds`)
  next()
})
tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;