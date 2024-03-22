const fs = require('fs');
const Tour = require('../models/tourModel');
const { json } = require('express');


exports.getAllTour = async (req, res) => {
    try {

        console.log(req.query);
        //build query
        //1A)filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'limit', 'sort', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        //1B)advance filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        let query = Tour.find(JSON.parse(queryStr));
        // 2) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(`Sorting by: ${sortBy}`); // Debugging: Log the sorting criteria
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default sorting if none is provided
        }
        //3 limiting fields
        if (req.query.fields) {
            fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }
        //4)pagination 
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skipVal = (page - 1) * limit
        query = query.skip(skipVal).limit(limit)
        //excute the query
        const tours = await query
        //send responce
        res.status(200).json({
            status: 'success',
            requistedAt: req.requestTime,
            result: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'Server error while reading data ...😢🥹'
        })
    }
}
exports.createTour = async (req, res) => {
    try {
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
            message: error
        })
    }
}
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error
        })
    }
}
exports.deleteTour = async (req, res) => {
    await Tour.findByIdAndRemove(req.params.id)
    try {
        res.status(204).json({
            status: 'success',
            data: {
                tour: null
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error
        })
    }
}