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


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on ${port}...`);
})