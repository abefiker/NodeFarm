const express = require('express');
const app = express()

const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
//1) Middlewares
app.use(express.json())
if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('dev'))
}

app.use(express.static(`${__dirname}/public`))
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋')
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

//2) Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    const err = new Error()
    err.status = 'fail'
    err.statusCode = 404
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorHandler)
module.exports = app