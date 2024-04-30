const multer = require('multer');
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const factory = require('./handlerFactory')
const sharp = require('sharp')


const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {

    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image ! Please upload only images.', 400), false)
    }

}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo')
exports.resizeUserPhoto = catchAsync(async(req, res, next) => {
    if (!req.files) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next()
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key]
        }
    })
    return newObj
}
exports.getAllusers = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.getUser = factory.getOne(User)
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}
exports.updateMe = catchAsync(async (req, res, next) => {
    //1)create error if user pots password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('this routes is not for updating password, please use /updatePassword for that!', 400))
    }
    //2)filtered out unwated fields
    const filteredBody = filterObj(req.body, 'name', 'email')
    if (req.file) filteredBody.photo = req.file.filename
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
    await User.findByIdAndUpdate(req.user.id, { active: false }, { new: true, runValidators: true })

    res.status(204).json({
        status: 'Success',
        user: null
    })
})
