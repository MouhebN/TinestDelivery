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

        // Find the stock for the given agenceId
        const stock = await Stock.findOne({agence: agenceId});

        if (!stock) {
            return res.status(404).json({error: 'Stock not found for the connected magasinier'});
        }

        // Filter colis with status 'en stock'
        const colisEnStock = stock.colis.filter((colis) => colis.status === 'en stock');

        // Get the count of colis in stock.colis array
        const colisEnStockCount = colisEnStock.length;

        return res.status(200).json(colisEnStockCount);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.getNumberColisEnCours = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        const stock = await Stock.findOne({agence: agenceId});
        if (!stock) {
            return res.status(404).json({error: 'Stock not found for the connected magasinier'});
        }

        // Filter colis with status 'en stock'
        const colisEnStock = stock.colis.filter((colis) => colis.status === 'en cours');

        // Get the count of colis in stock.colis array
        const colisEnStockCount = colisEnStock.length;

        return res.status(200).json(colisEnStockCount);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}
exports.getNumberColisEnRetour = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        // Find the stock for the given magasinierId
        const stock = await Stock.findOne({agence: agenceId});
        if (!stock) {
            return res.status(404).json({error: 'Stock not found for the connected magasinier'});
        }

        // Filter colis with status 'en stock'
        const colisEnStock = stock.colis.filter((colis) => colis.status === 'retour en stock');

        // Get the count of colis in stock.colis array
        const colisEnStockCount = colisEnStock.length;

        return res.status(200).json(colisEnStockCount);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({error: 'Internal server error'});
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

        // Find the delivery person (livreur) based on the provided livreurId
        const livreur = await livreurModel.findOne({ userId })
        if (!livreur) {
            return res.status(404).json({error: 'Livreur not found'});
        }

        // Find the agency (agence) associated with the livreur
        const agenceId = livreur.agence;
        const stock = await Stock.findOne({agence: agenceId});
        console.log("agenceId:", agenceId);

        if (!stock) {
            return res.status(404).json({error: 'Stock not found for the connected agency'});
        }
        // Find the index of the colis in the stock.colis array
        const colisIndex = stock.colis.findIndex((colis) => colis._id.toString() === colisId);
        console.log("colisId:", colisId);
        console.log("colisIndex:", colisIndex);

        if (colisIndex === -1) {
            return res.status(400).json({error: 'Colis not found in the stock'});
        }

        // Update the status of the colis in the stock.colis array
        stock.colis[colisIndex].status = 'livré';
        stock.colis[colisIndex].dateLivraison = datelivraison;
        // Save the changes to the stock
        await stock.save();

        // Update the status of the existing colis document in the colis collection
        await colisModel.findByIdAndUpdate(colisId, {status: 'livré', dateLivraison: datelivraison});

        // Remove the colis from the livreur's colis array
        livreur.colis = livreur.colis.filter((colis) => colis._id.toString() !== colisId);

        // Save the changes to the livreur
        await livreur.save();
        return res.status(200).json({message: 'Colis livré at ', datelivraison});
    } catch (error) {
        console.error('Error updating colis status:', error);
        return res.status(500).json({error: 'Internal server error'});
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

        // Find the delivery person (livreur) based on the provided livreurId
        const livreur = await livreurModel.findOne({ userId })
        if (!livreur) {
            return res.status(404).json({error: 'Livreur not found'});
        }
        // Find the agency (agence) associated with the livreur
        const agenceId = livreur.agence;
        const stock = await Stock.findOne({agence: agenceId});
        console.log("agenceId:", agenceId);

        if (!stock) {
            return res.status(404).json({error: 'Stock not found for the connected livreur'});
        }
        // Find the index of the colis in the stock.colis array
        const colisIndex = stock.colis.findIndex((colis) => colis._id.toString() === colisId);
        console.log("colisId:", colisId);
        console.log("colisIndex:", colisIndex);

        if (colisIndex === -1) {
            return res.status(400).json({error: 'Colis not found in the stock'});
        }

        // Update the status of the colis in the stock.colis array
        stock.colis[colisIndex].status = 'retour au fournisseur';

        // Save the changes to the stock
        await stock.save();
        // Update the status of the existing colis document in the colis collection
        await colisModel.findByIdAndUpdate(colisId, {status: 'retour au fournisseur'});
        livreur.colis = livreur.colis.filter((colis) => colis._id.toString() !== colisId);
        // Save the changes to the livreur
        await livreur.save();
        return res.status(200).json({message: 'Colis en retour au fournisseur '});
    } catch (error) {
        console.error('Error Colis en retour au fournisseur:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

