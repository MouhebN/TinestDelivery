const jwt = require('jsonwebtoken');
const fournisseurModel = require('../Models/fournisseur');
const { jwtSecret } = require(".././config");

const getFournisseurIdFromToken = async (token) => {
    try {
        if (!token) {
            console.log('Token is required',Error);
        }

        // Verify the token and retrieve the payload
        const decodedToken = jwt.verify(token, jwtSecret);

        // Access the user ID from the decodedToken
        const userId = decodedToken.userId;

        // Find the fournisseur based on the userId
        const fournisseur = await fournisseurModel.findOne({ userId });

        if (!fournisseur) {
            console.log('fournisseur not found',Error);
        }

        // Retrieve the fournisseur ID from the fournisseur document
        return fournisseur._id;
    } catch (error) {
        console.log('error',error);
    }
};

module.exports = getFournisseurIdFromToken;
