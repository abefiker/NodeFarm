const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
exports.checkID = (req,res,next,val)=>{
    console.log(`Tour id : ${val}`)
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json(
            {
                status: 'error',
                message: 'Tour not found'
            }
        )
    }
    next();
}
exports.checkBody = (req,res,next)=>{
    console.log(`Tour name : ${req.body.name} , Tour price : ${req.body.price}`);
    if(!req.body.name || !req.body.price){
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
        result: tours.length,
        data: {
            tours: tours
        }
    })
}
exports.getTour = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
}
exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
    console.log(req.body);
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