const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});


const postSchema = new mongoose.Schema({
    userId: Number,
    title: String,
    body: String
});

const postModel = mongoose.model('Post', postSchema);


const userModel = mongoose.model('User', userSchema);

module.exports = { userModel,postModel };
