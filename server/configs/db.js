require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = "mongodb+srv://astrophile:astrophile@assignment.rscsphg.mongodb.net/?retryWrites=true&w=majority&appName=assignment";

async function connectDB () {
    try {
        await mongoose.connect(connectionString)
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
