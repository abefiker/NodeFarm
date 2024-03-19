const express = require('express');
const fs = require('fs')
const app = express()
const morgan = require('morgan')
//1) Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋')
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
//2) route handlers
////////////////////Tour handlers////////////////////////////////
const getAllTour = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requistedAt: req.requestTime,
        result: tours.length,
        data: {
            tours: tours
        }
    })
}
const getTour = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
}
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
    console.log(req.body);
}
const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        res.status(404).json(
            {
                status: 'error',
                message: 'Tour not found'
            }
        )
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour is here ...>'
        }
    })
}
const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        res.status(404).json(
            {
                status: 'error',
                message: 'Tour not found'
            }
        )
    }
    res.status(204).json({
        status: 'success',
        data: {
            tour: null
        }
    })
}
////////////////////////////////User handling////////////////////////////////
const getAllusers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not Implemented yet'
    })
}
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not Implemented yet'
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not Implemented yet'
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not Implemented yet'
    })
}
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Not Implemented yet'
    })
}
//3) Routes
////////////////////////////////tours routes////////////////////////////////
app.route('/api/v1/tours').get(getAllTour).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)
////////////////////////////////users routes////////////////////////////////
app.route('/api/v1/users').get(getAllusers).post(createUser)
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)


//4) Start the server
const port = 3000
app.listen(port, () => {
    console.log(`App listening on ${port}...`)
})