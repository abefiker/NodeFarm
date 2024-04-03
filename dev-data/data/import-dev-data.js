const fs = require('fs');
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')
const Review = require('../../models/reviewModel')
const User = require('../../models/userModel')


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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))

const importData = async () => {
    try {
        // Import tours
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

        // Import users
        for (const user of users) {
            try {
                await User.create(user);
                console.log(`User "${user.name}" imported successfully! 😃`);
            } catch (error) {
                // Check if the error is due to duplicate key
                if (error.code === 11000) {
                    console.log(`User "${user.name}" already exists, skipping...`);
                } else {
                    throw error; // Rethrow other errors
                }
            }
        }

        // Import reviews
        for (const review of reviews) {
            try {
                await Review.create(review);
                console.log(`Review by "${review.user}" imported successfully! 😃`);
            } catch (error) {
                // Check if the error is due to duplicate key
                if (error.code === 11000) {
                    console.log(`Review by "${review.user}" already exists, skipping...`);
                } else {
                    throw error; // Rethrow other errors
                }
            }
        }


        console.log('All data imported successfully! 😀😃😄😁😆😅😂🙂😉😊😇😍');
        process.exit(0);
    } catch (error) {
        console.log(error);
    }
}



const deleteData = async () => {
    try {
        await Tour.deleteMany({})
        await Review.deleteMany({})
        await User.deleteMany({})
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
