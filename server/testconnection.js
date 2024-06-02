const mongoose = require('mongoose');

async function testConnection(req,res) {
    try {
        await mongoose.connect('mongodb+srv://astrophile:astrophile@assignment.rscsphg.mongodb.net/?retryWrites=true&w=majority&appName=assignment');

        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,
        }));

        const newUser = new User({ email: 'test@example.com', password: 'password' });
        console.log(newUser.email);
        const {email}=newUser.email;
        const alreadyExist = await User.find( {email} );
        if (alreadyExist) {
            console.log('User already exists!');
            res.status(400).json({ message: 'User already exists!' });
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    console.log('Error hashing password:', err);
                    res.status(500).json({ message: 'Error hashing password' });
                } else {
                    const user = new User({ email, password: hash });
                    await user.save();
                    console.log('Your account is created successfully!');
                    res.status(200).json({ message: 'Your account is created successfully!' });
                }
            });
        }
        // await newUser.save();
        // console.log('User saved successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

testConnection();
