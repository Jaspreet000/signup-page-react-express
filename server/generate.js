const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Print the generated secret key
console.log(generateSecretKey());