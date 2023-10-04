const Stock = require('../Models/stock');
const livreurModel = require("../Models/livreur");
const colisModel = require("../Models/colis");
const User = require("../Models/user")
const {jwtSecret} = require("../config");
const jwt = require('jsonwebtoken');
const getAgenceIdFromToken = require("../Utils/getAgenceIdFromToken");



exports.ajouterStock = (req, res) => {
    const {colis, agence} = req.body;

    const stock = new Stock({
        colis,
        agence,
    });

    stock.save()
        .then((nouveauStock) => {
            res.status(200).json({stock: nouveauStock});
        })
        .catch((erreur) => {
            res.status(400).json({erreur});
        });
};
exports.modifierStock = (req, res) => {
    const stockId = req.params.id;
    const modifications = req.body;

    Stock.findByIdAndUpdate(stockId, modifications)
        .then(() => {
            res.status(200).json({message: 'Stock modifié avec succès'});
        })
        .catch((erreur) => {
            res.status(400).json({erreur});
        });
};
exports.supprimerStock = (req, res) => {
    const stockId = req.params.id;

    Stock.findByIdAndDelete(stockId)
        .then(() => {
            res.status(200).json({message: 'Stock supprimé avec succès'});
        })
        .catch((erreur) => {
            res.status(400).json({erreur});
        });
};
exports.listerStocks = (req, res) => {
    Stock.find()
        .then((stocks) => {
            res.status(200).json({stocks});
        })
        .catch((erreur) => {
            res.status(400).json({erreur});
        });

};
exports.getNumberColisEnStock = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Find the number of colis with status 'en cours' and matching agenceId
        const colisEnCoursCount = await colisModel.countDocuments({ status: 'en stock', agence: agenceId });

        return res.status(200).json(colisEnCoursCount);
    } catch (error) {
        console.error('Error getting colis data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getNumberColisEnCours = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Find the number of colis with status 'en cours' and matching agenceId
        const colisEnCoursCount = await colisModel.countDocuments({ status: 'en cours', agence: agenceId });

        return res.status(200).json(colisEnCoursCount);
    } catch (error) {
        console.error('Error getting colis data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getNumberColisEnRetour = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Find the number of colis with status 'en cours' and matching agenceId
        const colisEnCoursCount = await colisModel.countDocuments({ status: 'retour en stock', agence: agenceId });

        return res.status(200).json(colisEnCoursCount);
    } catch (error) {
        console.error('Error getting colis data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
exports.payementColis = async (req, res) => {
    const colisId = req.body.id;
    const datelivraison = new Date();
    try {
        console.log('payementColis route accessed');
        // Get the token from the request headers
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify the token and retrieve the payload
        const decodedToken = jwt.verify(token, jwtSecret);

        // Access the user ID from the decodedToken
        const userId = decodedToken.userId;

        // Find the delivery person (livreur) based on the provided userId
        const livreur = await livreurModel.findOne({ userId });
        if (!livreur) {
            return res.status(404).json({ error: 'Livreur not found' });
        }
        // Find the colis document based on the provided colisId
        const colis = await colisModel.findById(colisId);
        if (!colis) {
            return res.status(404).json({ error: 'Colis not found' });
        }
        // Update the status and dateLivraison of the colis document
        colis.status = 'livré';
        colis.dateLivraison = datelivraison;
        await colis.save();

        livreur.colis.pull(colis._id);
        await livreur.save();

        return res.status(200).json({ message: 'Colis livré at ', datelivraison });
    } catch (error) {
        console.error('Error updating colis status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.retourAuFournisseur = async (req, res) => {

    const colisId = req.body.id;
    try {
        // Get the token from the request headers
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify the token and retrieve the payload
        const decodedToken = jwt.verify(token, jwtSecret);
        // Access the user ID from the decodedToken
        const userId = decodedToken.userId;
        // Find the delivery person (livreur) based on the provided userId
        const livreur = await livreurModel.findOne({ userId });
        if (!livreur) {
            return res.status(404).json({ error: 'Livreur not found' });
        }
        // Find the colis document based on the provided colisId
        const colis = await colisModel.findById(colisId);
        if (!colis) {
            return res.status(404).json({ error: 'Colis not found' });
        }
        // Update the status of the colis document
        colis.status = 'retour au fournisseur';
        await colis.save();
        // Remove the colis from the livreur's colis array
        livreur.colis.pull(colis._id);
        await livreur.save();

        return res.status(200).json({ message: 'Colis en retour au fournisseur' });
    } catch (error) {
        console.error('Error Colis en retour au fournisseur:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


