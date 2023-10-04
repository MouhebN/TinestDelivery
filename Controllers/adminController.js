
const Magasinier = require('../Models/magasinier');
const Livreur = require('../Models/livreur');
// Import other model schemas for different roles

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let newUser;
        // Create user based on the selected role
        if (role === 'magasinier') {
            newUser = new Magasinier({ username, password, role });
        } else if (role === 'livreur') {
            newUser = new Livreur({ username, password, role });
        } // Add more conditions for other roles

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

