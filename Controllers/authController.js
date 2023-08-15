const bcrypt = require('bcrypt');
const Magasinier = require('../Models/magasinier');
const livreurModel = require('../Models/livreur');
const chefAgenceModel = require('../Models/chefAgence');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require("../config");

exports.register = async (req, res) => {
    try {
        const { username, password, role, agence, ...roleData } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the 'users' collection
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            agence,
        });

        // Save the new user to the 'users' collection
        const savedUser = await newUser.save();

        // Create a new role-specific model instance based on the provided role
        let newRoleUser;
        switch (role) {
            case 'magasinier':
                newRoleUser = new Magasinier({ userId: savedUser._id, agence: savedUser.agence, ...roleData });
                break;
            case 'livreur':
                newRoleUser = new livreurModel({ userId: savedUser._id, agence: savedUser.agence, ...roleData });
                break;
            case 'chefAgence':
                newRoleUser = new chefAgenceModel({ userId: savedUser._id, agence: savedUser.agence, ...roleData });
                break;
            // Add cases for other roles
            default:
                return res.status(400).json({ error: 'Invalid role' });
        }

        // Save the new user to the specific role collection
        await newRoleUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        // Compare the provided password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Password incorrect' });
        }
        const role = user.role;
        const token = jwt.sign({ userId: user.id, role ,username}, jwtSecret,{ expiresIn: '1d' });
        // save user token
        user.token = token;
        res.status(200).json({ message: 'Login successful', token, role });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.welcome = async (req, res) => {
    try {
        const token = req.header('x-access-token');

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify the token and retrieve the payload
        const decodedToken = jwt.verify(token, jwtSecret);
        const { username } = decodedToken;
        // Display a welcome message with the username
        const welcomeMessage = `Welcome, ${username}!`;
        res.status(200).json({ message: welcomeMessage });
    } catch (error) {
        console.error('Error during welcome:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


