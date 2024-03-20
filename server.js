const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app');
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE
mongoose
  // .connect(process.env.DATABASE_LOCAL ,{ 
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB successfully!')
  }).catch(err => {
    console.log(err)
  });

const tourSchema = new mongoose.Schema({
  name :{
    type: String,
    required: [true,'A Tour must have a name 😢'],
    unique:true
  },
  rating :{
    type:Number,
    default:4.5
  },
  price : {
    type:Number,
    required: [true,'A Tour must have a price 😢']
  }
})  
const Tour = mongoose.model('Tour',tourSchema)
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on ${port}...`);
})