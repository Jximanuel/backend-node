const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }

    const bearerToken = token.split(' ')[1];

    // Log token dan error untuk debugging
    console.log('Bearer Token:', bearerToken);

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);  // Log error untuk debugging
            return res.status(401).json({ msg: 'Invalid token.' });
        }

        // Log decoded token untuk memastikan payload
        console.log('Decoded Token:', decoded);

        req.email = decoded.email; // Ambil email dari token
        next(); // Lanjutkan ke middleware atau route berikutnya
    });
};


module.exports = auth;
