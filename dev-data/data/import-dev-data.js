const fs = require('fs');
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB successfully!')
    })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async () => {
    try {
        for (const tour of tours) {
            try {
                await Tour.create(tour);
                console.log(`Tour "${tour.name}" imported successfully! 😃`);
               
            } catch (error) {
                // Check if the error is due to duplicate key
                if (error.code === 11000) {
                    console.log(`Tour "${tour.name}" already exists, skipping...`);
                } else {
                    throw error; // Rethrow other errors
                }
            }
        }
        console.log('All data imported successfully! 😀😃😄😁😆😅😂🙂😉😊😇😍');
        process.exit(0)
    } catch (error) {
        console.log(error);
    }
}



const deleteData = async () => {
    try {
        await Tour.deleteMany({})
        console.log('Data deleted successfully! 🥲😢😭😿🥹')
        process.exit(0)
    } catch (error) {
        console.log(error)
    }
}

if (process.argv.includes('--import')) {
    importData()
} else if (process.argv.includes('--delete')) {
    deleteData()
}
