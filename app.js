const express = require('express');
const fs = require('fs')
const app = express()
app.use(express.json())
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋')
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
const getAllTour = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requistedAt:req.requestTime,
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
// app.get('/api/v1/tours',getAllTour)
// app.post('/api/v1/tours',createTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)
app.route('/api/v1/tours').get(getAllTour).post(createTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)
const port = 3000
app.listen(port, () => {
    console.log(`App listening on ${port}...`)
})