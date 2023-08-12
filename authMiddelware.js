const User = require('./Models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("./config");

function authenticateToken(req, res, next) {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    jwt.verify(token, jwtSecret ,{ maxAge: '1d' }, async (err, data) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.redirect('/login');
        } else {
            try {
                const user = await User.findOne({ _id: data.userId }); // Use data.userId instead of data.id
                if (user) {
                    req.user = user;
                    next();
                } else {
                    console.log('User not found:', data.userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    });
}


module.exports = authenticateToken;

