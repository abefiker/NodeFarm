const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
exports.getAllusers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-__v')
    res.status(200).json({
        status: 'Success',
        result:users.length,
        data: users
    })
})
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id })
    res.status(200).json({
        status: 'Success',
        data: newUsersers
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'Success',
        data: user
    })
})
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndDelete(req.params.id)
    if (!user) {
        return next(new AppError('No user found with this ID', 404))
    }
    res.status(200).json({
        status: 'Success',
        user: null
    })
})