const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
exports.getOverview = catchAsync(async(req,res)=>{
    const tours = await Tour.find()
    res.status(200).render('overview',{
        title : 'All Tours',
        tours 
    })
})

exports.getTour = catchAsync((async(req,res)=>{
    // 1)Get the data , for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path : 'reviews',
        select : 'review rating user',
    })
    //2)build template 
    //3)render template using data from 1)
    res.status(200).render('tour',{
        title: `${tour.name}`,
        tour
    })
}))

exports.getLoginForm = catchAsync(async (req,res)=>{
    res.status(200).render('login')
})