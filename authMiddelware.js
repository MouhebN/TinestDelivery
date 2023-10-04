const User = require('./Models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("./config");

function authenticateToken(req, res, next) {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    jwt.verify(token, jwtSecret, { maxAge: '1d' }, async (err, data) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).json({ error: "Invalid token" });
        } else {
            try {
                const user = await User.findOne({ _id: data.userId });
                if (user) {
                    req.user = user;
                    next();
                } else {
                    console.log('User not found:', data.userId);
                    return res.status(404).json({ error: "User not found" });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    });
}

module.exports = authenticateToken;
