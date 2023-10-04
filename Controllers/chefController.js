const livreurModel = require("../Models/livreur");
const colisModel = require("../Models/colis");
const fournisseurModel = require('../Models/fournisseur');
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");
const getAgenceIdFromToken = require("../Utils/getAgenceIdFromToken");
const Stock = require("../Models/stock");
const axios = require("axios");
exports.getLivreurColis = async (req, res) => {
    try {
        const {livreurId} = req.query;
        const livresColis = await colisModel.find({livreur: livreurId, status: 'livré'});
        // Map and populate Fournisseur information for each colis
        const colisWithFournisseurInfo = await Promise.all(livresColis.map(async (colis) => {
            const fournisseur = await fournisseurModel.findById(colis.fournisseur);

            return {
                ...colis.toObject(),
                fournisseur: {
                    nom: fournisseur ? fournisseur.nom : '',
                    address: fournisseur ? fournisseur.address : '',
                    telephone: fournisseur ? fournisseur.telephone : '',
                },
            };
        }));
        res.status(200).json(colisWithFournisseurInfo);
    } catch (error) {
        console.error('Error fetching livreur livré colis:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
exports.calculateTotalAmountForLivreur = async (req, res) => {
    try {
        const {livreurId} = req.query;
        // Find all "livré" colis for the specific livreur
        const livresColis = await colisModel.find({livreur: livreurId, status: 'livré'});

        // Calculate the total amount considering different pricing based on retourCount
        let totalAmount = 0;
        livresColis.forEach(colis => {
            if (colis.retourCount === 0) {
                totalAmount += colis.prix + 7; // Add 7 Dinar for retourCount = 0
            } else {
                totalAmount += colis.prix + (colis.retourCount * 5); // Add (retourCount * 5) Dinar for retourCount != 0
            }
        });
        res.status(200).json({totalAmount});
    } catch (error) {
        console.error('Error calculating total amount for livreur:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
exports.getColisEnAttente = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Use Mongoose's .find() method to query the database
        const colisEnAttente = await colisModel.find({
            status: 'en attente',
            agence: agenceId,
            livreurPickup: { $exists: false }
        });
        const colisWithFournisseurInfo = await Promise.all(colisEnAttente.map(async (colis) => {
            const fournisseur = await fournisseurModel.findById(colis.fournisseur);

            return {
                ...colis.toObject(),
                fournisseur: {
                    nom: fournisseur ? fournisseur.nom : '',
                    address: fournisseur ? fournisseur.address : '',
                    telephone: fournisseur ? fournisseur.telephone : '',
                },
            };
        }));

        res.status(200).json(colisWithFournisseurInfo);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.getColisAgence = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Use Mongoose's .find() method to query the database
        const colisAgence = await colisModel.find({
            status: { $ne: 'en attente' },
            agence: agenceId
        })


        const colisWithFournisseurInfo = await Promise.all(colisAgence.map(async (colis) => {
            const fournisseur = await fournisseurModel.findById(colis.fournisseur);
            const livreur = await livreurModel.findById(colis.livreur);
            const livreurpickup = await livreurModel.findById(colis.livreurPickup);

            return {
                ...colis.toObject(),
                fournisseur: {
                    nom: fournisseur ? fournisseur.nom : '',
                    address: fournisseur ? fournisseur.address : '',
                    telephone: fournisseur ? fournisseur.telephone : '',
                },
                livreur: {
                    nom: livreur ? livreur.nom : '',
                },
                livreurPickup: {
                    nom: livreurpickup ? livreurpickup.nom : '',
                },
            };
        }));

        res.status(200).json(colisWithFournisseurInfo);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.getStatus = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const colisAgence = await colisModel.find({ agence: agenceId });

        const allStatuses = ['en attente', 'en stock', 'en cours', 'retour en stock', 'livré', 'en pickup',
            'annulé', 'retour au fournisseur', 'livré et payé', 'payé']; // List of all possible statuses

        const statusDistribution = {};

        // Initialize all statuses with a count of 0
        allStatuses.forEach(status => {
            statusDistribution[status] = 0;
        });

        // Increment counts based on fetched data
        colisAgence.forEach(colis => {
            const status = colis.status;
            statusDistribution[status] += 1;
        });

        res.json(statusDistribution);
    } catch (error) {
        console.error('Error fetching colis data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.timeDiff=async (req,res)=> {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const colisData = await colisModel.find({ agence: agenceId });

        const timeDifferences = colisData
            .filter(colis => colis.datePickup && colis.dateLivraison)
            .map(colis => {
                const pickupDate = new Date(colis.datePickup);
                const deliveryDate = new Date(colis.dateLivraison);
                const timeDiff = deliveryDate - pickupDate;
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                return hoursDiff;
            });

        res.json({ timeDifferences });
        console.log("timeDifferences :",timeDifferences)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getLivredEtPayeColisCountOverTime = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const colisData = await colisModel.find({ agence: agenceId, status: "livré et payé" });

        const colisCountByTimestamp = colisData.reduce((acc, colis) => {
            const timestamp = colis.dateLivraison.getTime(); // Convert to timestamp
            acc[timestamp] = (acc[timestamp] || 0) + 1; // Increment count
            return acc;
        }, {});

        const colisCountData = Object.keys(colisCountByTimestamp).map(timestamp => ({
            timestamp: Number(timestamp),
            colisCount: colisCountByTimestamp[timestamp],
        }));

        res.json(colisCountData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTopLivreurs = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const topLivreurs = await colisModel.aggregate([
            {
                $match: { agence: agenceId }
            },
            {
                $group: {
                    _id: '$livreur',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'livreurs', // Replace with your actual collection name
                    localField: '_id',
                    foreignField: '_id',
                    as: 'livreur'
                }
            },
            {
                $unwind: '$livreur'
            },
            {
                $project: {
                    _id: '$livreur._id',
                    nom: '$livreur.nom',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json(topLivreurs);
    } catch (error) {
        console.error('Error getting top livreurs data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getColisVolumeByFournisseur = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        const colisVolumeByFournisseur = await colisModel.aggregate([
            {
                $match: { agence: agenceId }
            },
            {
                $group: {
                    _id: '$fournisseur',
                    volume: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'fournisseurs', // Make sure this collection name is correct
                    localField: '_id',
                    foreignField: '_id',
                    as: 'fournisseur'
                }
            },
            // You might skip $unwind if each _id in colis corresponds to a unique _id in fournisseurs
            {
                $unwind: '$fournisseur'
            },
            {
                $project: {
                    _id: '$fournisseur._id',
                    nom: '$fournisseur.nom',
                    volume: 1
                }
            }
        ]);

        res.status(200).json(colisVolumeByFournisseur);
    } catch (error) {
        console.error('Error getting colis volume by fournisseur data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

