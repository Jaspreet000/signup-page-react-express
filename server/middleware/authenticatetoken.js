const jwt = require('jsonwebtoken');
require('dotenv').config();
secret_key = process.env.JWT_SECRET_KEY

// Middleware function to verify JWT token
const authenticatetoken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, secret_key, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticatetoken;
