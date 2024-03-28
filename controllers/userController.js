const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key]
        }
    })
    return newObj
}
exports.getAllusers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-__v')
    res.status(200).json({
        status: 'Success',
        result: users.length,
        data: users
    })
})
// exports.getUser = catchAsync(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.params.id })
//     res.status(200).json({
//         status: 'Success',
//         data: newUsersers
//     })
// })

exports.updateMe = catchAsync(async (req, res, next) => {
    //1)create error if user pots password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('this routes is not for updating password, please use /updatePassword for that!', 400))
    }
    //2)filtered out unwated fields
    const filteredBody = filterObj(req.body, 'name', 'email')
    //3)update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'Success',
        data: updatedUser
    })

})
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id,{active:false},{new :true , runValidators:true})

    res.status(204).json({
        status: 'Success',
        user: null
    })
})
