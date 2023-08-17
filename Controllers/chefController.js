
const livreurModel = require("../Models/livreur");
const colisModel = require("../Models/colis");
const fournisseurModel = require('../models/fournisseur');
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");
exports.getLivreurColis = async (req, res) => {
    try {
        const {livreurId} = req.query;
        const livresColis = await colisModel.find({ livreur:livreurId ,status: 'livré' });
        // Map and populate Fournisseur information for each colis
        const colisWithFournisseurInfo = await Promise.all(livresColis.map(async (colis) => {
            const fournisseur = await fournisseurModel.findById(colis.fournisseur);

            return {
                ...colis.toObject(),
                fournisseur: {
                    nom: fournisseur ? fournisseur.nom : '',
                    adresse: fournisseur ? fournisseur.adresse : '',
                    numero: fournisseur ? fournisseur.numero : '',
                },
            };
        }));
        res.status(200).json(colisWithFournisseurInfo);
    } catch (error) {
        console.error('Error fetching livreur livré colis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.calculateTotalAmountForLivreur = async (req, res) => {
    try {
        const {livreurId} = req.query;
        // Find all "livré" colis for the specific livreur
        const livresColis = await colisModel.find({ livreur: livreurId, status: 'livré' });

        // Calculate the total amount considering different pricing based on retourCount
        let totalAmount = 0;
        livresColis.forEach(colis => {
            if (colis.retourCount === 0) {
                totalAmount += colis.prix + 7; // Add 7 Dinar for retourCount = 0
            } else {
                totalAmount += colis.prix + (colis.retourCount * 5); // Add (retourCount * 5) Dinar for retourCount != 0
            }
        });
        res.status(200).json({ totalAmount });
    } catch (error) {
        console.error('Error calculating total amount for livreur:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};