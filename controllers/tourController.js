const fs = require('fs');
const Tour = require('../models/tourModel')


exports.checkBody = (req, res, next) => {
    console.log(`Tour name : ${req.body.name} , Tour price : ${req.body.price}`);
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide tour name and price'
        })
    }
    next();
}
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
exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour
        // }
    });
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