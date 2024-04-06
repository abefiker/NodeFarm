const path = require('path')
const express = require('express');
const app = express()
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitizer = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
//1) Global Middlewares
//set secure http headers
app.use(helmet())
//development logging 
if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('dev'))
}
//body parser , reading data from body to req.body 
app.use(express.json({ limit: '10kb' }))
//Data sanitization against NoSql query injection
app.use(mongoSanitizer())
//Data sanitization against xss
app.use(xss())
//prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingQuantity',
        'price',
        'difficulty',
        'maxGroupSize'
    ]
}))
//serving static files
//Test middleware
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋')
    next()
})
//limiting request from the same API
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
    message: 'Too many requests from this IP , please try again in an hour.'
})
app.use('/api', limiter)
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()

    next()
})

//2) Routes
app.get('/', (req, res) => {
    res.status(200).render('base',{
        tour : 'The Forset Hiker',
        user : 'Abemelek'
    })
})
app.get('/overview',(req,res)=>{
    res.status(200).render('overview',{
        title : 'All Tours',
    })
})
app.get('/tour',(req,res)=>{
    res.status(200).render('tour',{
        title : 'The Forset Hiker'
    })
})
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.all('*', (req, res, next) => {
    const err = new Error()
    err.status = 'fail'
    err.statusCode = 404
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorHandler)
module.exports = app