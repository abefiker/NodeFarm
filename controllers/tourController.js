const fs = require('fs');
const Tour = require('../models/tourModel')


exports.getAllTour = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requistedAt: req.requestTime,
        // result: tours.length,
        // data: {
        //     tours: tours
        // }
    })
}
exports.getTour = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    // const tour = tours.find(el => el.id === id)
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour: tour
    //     }
    // })
}
exports.createTour = async (req, res) => {
    try {
        // const newTour = await Tour.create({
        //     name: req.body.name,
        //     rating: req.body.rating,
        //     price: req.body.price
        // })
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: 'Invalid Data Sent!'
        })
    }
}
exports.updateTour = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour is here ...>'
        }
    })
}
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: {
            tour: null
        }
    })
}