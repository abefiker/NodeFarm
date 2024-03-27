const { promisify } = require('util');
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })
    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'Success',
        token,
        data: newUser
    })
})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new AppError('please provide a email and password', 400))
    }
    const user = await User.findOne({ email: email }).select('+password')
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
    const token = signToken(user._id)
    res.status(200).json({
        status: 'Success',
        token
    })
})
exports.protect = catchAsync(async (req, res, next) => {
    //protecting existing route
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('Your not loged in! , please log in to get access', 401))
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    const currentUser = await User.findOne({ _id: decoded.id });
    if (!currentUser) {
        return next(new AppError('the user belongs to this token does no longer exists', 401))
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Your password has expired, please change it, please current', 401))
    }
    req.user = currentUser
    next()
})