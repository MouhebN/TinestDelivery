const livreurModel = require('../Models/livreur');
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

exports.getLivreurColis = async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        // Verify the token and retrieve the payload
        const decodedToken = jwt.verify(token, jwtSecret);

        // Access the user ID from the decodedToken
        const userId = decodedToken.userId;

        // Find the livreur based on the user ID
        const livreur = await livreurModel.findOne({userId}).select('colis');

        if (!livreur) {
            return res.status(404).json({error: 'Livreur not found'});
        }

        // Extract the required colis information from the livreur's colis array
        const colisInfo = livreur.colis.map(colis => ({
            id: colis._id.toString(),
            destination: colis.destination,
            num_client: colis.num_client,
            nomClient: colis.nomClient,
            prenomClient: colis.prenomClient,
            date_creation: colis.date_creation,
            status: colis.status,
            retourCount: colis.retourCount
        }));

        return res.status(200).json(colisInfo);

    } catch (error) {
        console.error('Error fetching livreur data:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};



