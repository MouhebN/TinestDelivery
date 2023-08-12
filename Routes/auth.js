const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Registration route
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/welcome', authController.welcome);




module.exports = router;
