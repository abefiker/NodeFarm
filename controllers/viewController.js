const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find()
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });
    if (!tour) {
        return next(new AppError('No tour found with this name', 400))
    }
    // 3) Build template and render it using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name}`,
        tour
    });
});


exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login',
    })
}

exports.getAccount = (req, res) => {
    const user = req.user; // Assuming the user object is available in the request 
    res.render('account', {
        title: 'Account',
        user: user
    });
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    console.log(req.user)
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
        {
            new: true,
            runValidators: true
        })
    res.render('account', {
        title: 'Account',
        user: updatedUser
    });
})