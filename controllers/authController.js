const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/email')
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
        role: req.body.role
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
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(new AppError('You have not permissions to perform this action', 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        next(new AppError('user not found with this email', 404))
    }
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm 
    to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`
    try {
        await sendEmail({
            email: user.email,
            subject: 'your password reset token valid for 10 min',
            message
        })
        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email'
        })
    } catch (error) {
        user.passwordResetTokend = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return next(new AppError('There was an error sending the email. Please try again', 500))
    }

})
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    //2)if token not expires then there is a user, set the new password
    if (!user) {
        return next(new AppError('Token is Expired', 400))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    //3)change the chengedPasswordAt property for the user

    //4)log the user in and send JWT
    const token = signToken(user._id)
    res.status(200).json({
        status: 'Success',
        token
    })
})