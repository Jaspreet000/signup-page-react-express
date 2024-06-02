const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { userModel, postModel } = require('./models/user-model');
const authenticatetoken = require('./middleware/authenticatetoken');
const app = express();
const port = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Max 5 sign-up attempts per hour
    message: 'Too many sign-up attempts. Please try again later.',
  });


app.use('/signup', limiter)

const connectionString = "mongodb+srv://astrophile:astrophile@assignment.rscsphg.mongodb.net/?retryWrites=true&w=majority&appName=assignment";

async function connectDB() {
    try {
        await mongoose.connect(connectionString);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received signup request:', email, password);

    try {
        const alreadyExist = await userModel.findOne({ email });

        if (alreadyExist) {
            console.log('User already exists!');
            return res.status(400).json({ message: 'User already exists!' });
        }

        const hash = await bcrypt.hash(password, 5);
        const user = new userModel({ email, password: hash });
        await user.save();

        console.log('Your account is created successfully!');
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Your account is created successfully!', token });
    } catch (error) {
        console.log('Error occurred:', error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

app.get('/posts', authenticatetoken, async (req, res) => {
    try {
        const posts = await postModel.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `https://signup-page-react-express.vercel.app//reset-password/${token}`;

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset link has been sent to your email.' });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({ _id: decoded.userId, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const hash = await bcrypt.hash(password, 5);
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Your password has been reset successfully!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

app.listen(port, async () => {
    connectDB();
    console.log(`Server listening on port ${port}`);
});
