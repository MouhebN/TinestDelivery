const colisModel = require('../Models/colis');
const fournisseurModel = require('../models/fournisseur');
const livreurModel = require('../Models/livreur');
const Stock = require('../Models/stock');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require(".././config");
const getAgenceIdFromToken = require('../utils/getAgenceIdFromToken');
const getFournisseurIdFromToken = require("../Utils/getFournisseurdFromToken");


exports.ajouterColis = async (req, res) => {
    const fournisseurId = await getFournisseurIdFromToken(req.headers['x-access-token']);
    const colisObj = {
        fournisseur: fournisseurId,
        destination: req.body.destination,
        num_client: req.body.num_client,
        nomClient: req.body.nomClient,
        prenomClient: req.body.prenomClient,
        livreur: req.body.livreur,
        status: req.body.status,
        date_creation: Date.now(),
        prix: req.body.prix,
        typeDePayment: req.body.typeDePayment,
        largeur: req.body.largeur,
        hauteur: req.body.hauteur,
        typeColis: req.body.typeColis,
        livreurPickup: req.body.livreurPickup,
        agence: req.body.agence,
        nomArticle: req.body.nomArticle
    };

    const colis = new colisModel(colisObj);

    colis.save()
        .then(createdColis => {
            res.status(200).json({createdColis});
        })
        .catch(error => {
            res.status(400).json({error});
            console.log("error ajouter colis : ", error);
        });
};
exports.modifierColis = (req, res) => {
    const colisId = req.params.id;
    const modifiedColis = {
        fournisseur: req.body.fournisseur,
        destination: req.body.destination,
        num_client: req.body.num_client,
        nomClient: req.body.nomClient,
        prenomClient: req.body.prenomClient,
        livreur: req.body.livreur,
        status: req.body.status,
        date_creation: req.body.date_creation,
        prix: req.body.prix,
        typeDePayment: req.body.typeDePayment,
        largeur: req.body.largeur,
        hauteur: req.body.hauteur,
        typeColis: req.body.typeColis,
        livreurPickup:req.body.livreurPickup,
        agence:req.body.agence
    };

    colisModel.findByIdAndUpdate(colisId, modifiedColis)
        .then(updatedColis => {
            res.status(200).json({message: 'Colis modifié avec succès'});
        })
        .catch(error => {
            res.status(400).json({error});
        });
};
exports.supprimerColis = (req, res) => {
    const colisId = req.params.id;
    colisModel.findByIdAndDelete(colisId)
        .then(deletedColis => {
            res.status(200).json({message: 'Colis supprimé avec succès'});
        })
        .catch(error => {
            res.status(400).json({error});
        });
};
exports.listerColis = async (req, res) => {
    colisModel.find({})
        .then(colisList => {
            res.status(200).json({colisList});
        })
        .catch(error => {
            res.status(400).json({error});
        });
};
exports.listerColisFournisseur = async (req, res) => {
    const fournisseurId = await getFournisseurIdFromToken(req.headers['x-access-token']);
    colisModel.find({fournisseur:fournisseurId})
        .then(colisList => {
            res.status(200).json({colisList});
        })
        .catch(error => {
            res.status(400).json({error});
        });
};
exports.listerLivreurAgence = async (req, res) => {
    const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
    console.log("agenceID  : ",agenceId);
    livreurModel.find({agence: agenceId})
        .then((livreurList) => {
            res.status(200).json({livreurList});
        })
        .catch((error) => {
            res.status(400).json({error});
        })
};
exports.ajouterColisAuStock = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the colis by _id
        const colis = await colisModel.findById(id);

        if (!colis) {
            return res.status(400).json({ error: 'Colis not found' });
        }
        // Update the colis data
        colis.status = 'en stock';
        colis.dateEntredStock = new Date();

        // Save the updated colis
        await colis.save();

        res.status(200).json({ message: 'Colis status and date updated successfully' });
    } catch (error) {
        res.status(400).json({ error });
    }
};
exports.attribuerColisAuLivreur = async (req, res) => {
    try {
        const { livreurId, id } = req.body;

        // Step 1: Verify the existence of the selected livreur.
        const livreur = await livreurModel.findById(livreurId);

        // Step 2: Verify the existence of the selected colis.
        const colis = await colisModel.findById(id);

        if (!colis) {
            return res.status(404).json({ error: 'Colis not found' });
        }

        // Check if the colis already has a livreur assigned to it
        if (livreur.colis.includes(id)) {
            console.log('Colis already has a livreur assigned');
            return res.status(400).json({ error: 'Colis already has a livreur assigned' });
        }

        // Check if the colis is already assigned to a livreur
        if (colis.livreur) {
            console.log('Colis is already assigned to a livreur');
            return res.status(400).json({ error: 'Colis is already assigned to a livreur' });
        }

        // Retrieve the required fields from the colisModel using the colis ID
        const { prix, date_creation, status, num_client, destination ,nomClient,prenomClient ,retourCount ,datePickup ,fournisseur} = await colisModel.findById(id);

        // Update the colis with the livreur's details and change the status to "en cours".
        colis.livreur = livreurId;
        colis.status = 'en cours';
        await colis.save();

        // Update the colis in the colisModel
        await colisModel.findByIdAndUpdate(id, { livreur: livreurId, status: 'en cours' });

        // Add the retrieved fields to the livreur's colis array.
        livreur.colis.push({
            _id: id,
            prix,
            date_creation,
            status,
            num_client,
            destination,
            nomClient,
            prenomClient,
            retourCount,
            datePickup,
            fournisseur
        });
        await livreur.save();

        return res.status(200).json({ message: 'Colis attribué au livreur' });
    } catch (error) {
        console.error('Error attribuerColisAuLivreur:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.retourColisAuStock = async (req, res) => {
    try {
        const {id} = req.body;
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const stock = await Stock.findOne({agence: agenceId});

        if (!stock) {
            return res.status(404).json({error: 'Stock not found'});
        }

        // Find the colis in the stock's colis array
        const colisIndex = stock.colis.findIndex((colis) => colis._id.toString() === id);

        if (colisIndex === -1) {
            return res.status(404).json({error: 'Colis not found in the stock'});
        }

        // Get the colis from the stock's colis array
        const colis = stock.colis[colisIndex];
        console.log("status : ", colis.status);
        // Update the colis status based on the current status

        colis.set({status: 'retour en stock'});
        colis.retourCount += 1;
        console.log("updated status  : ", colis.status);
        // Save the updated stock
        await stock.save();
        await colisModel.findByIdAndUpdate(id, {status: 'retour en stock'});
        if (colis.livreur) {
            const livreur = await livreurModel.findById(colis.livreur);
            if (livreur) {
                livreur.colis = livreur.colis.filter((colisId) => colisId.toString() !== id);
                await livreur.save();
                console.log('colis removed from livreur ');
            }
        }
        return res.status(200).json({message: 'Colis status updated successfully', updatedColis: colis});
    } catch (error) {
        console.error('Error in retourColisAuStock:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.retourColisAuStock = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the colis by _id
        const colis = await colisModel.findById(id);
        console.log('colis',colis)

        if (!colis) {
            return res.status(404).json({ error: 'Colis not found' });
        }

        // Update the colis status and any other necessary fields
        colis.status = 'retour en stock';
        colis.retourCount += 1;

        // Save the updated colis
        await colis.save();

        if (colis.livreur) {
            const livreur = await livreurModel.findById(colis.livreur);


            if (livreur) {
                // Remove the colis using Mongoose's .pull() method
                livreur.colis.pull(colis._id);
                await livreur.save();
            }
        }
        return res.status(200).json({ message: 'Colis status updated successfully', updatedColis: colis });
    } catch (error) {
        console.error('Error in retourColisAuStock:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllColisFromStock = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Find all colis in the Colis collection with status 'en stock'
        const colisList = await colisModel.find({ agence: agenceId, status: 'en stock' });

        return res.status(200).json(colisList);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getLivreur = async (req, res) => {
    try {
        const {id} = req.params;
        // Find the livreur in the database by its ID
        const livreur = await livreurModel.findById(id);
        if (!livreur) {
            return res.status(404).json({error: 'Livreur not found'});
        }
        // Return the livreur data
        return res.status(200).json(livreur);
    } catch (error) {
        console.error('Error in getLivreur:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.getMultipleLivreur = async (req, res) => {
    try {
        const {ids} = req.query;
        const livreurs = await livreurModel.find({_id: {$in: ids}});
        return res.status(200).json(livreurs);
    } catch (error) {
        console.error('Error in getMultipleLivreur:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.getAllColisEnStock = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);

        // Find all colis in the Colis collection with status 'en stock' and agence matching
        const colisEnStock = await colisModel.find({ agence: agenceId, status: 'en stock' });

        return res.status(200).json(colisEnStock);
    } catch (error) {
        console.error('Error getting colis data from stock:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.pickUpColis = async (req, res) => {
    const colisId = req.body.id;
    const datepickup = new Date();
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

        // Find the delivery person (livreur) based on the provided livreurId
        const livreur = await livreurModel.findOne({userId})
        if (!livreur) {
            return res.status(404).json({error: 'Livreur not found'});
        }
        // Update the status of the existing colis document in the colis collection
        const updatedColis = await colisModel.findByIdAndUpdate(
            colisId,
            {status: 'en pickup', datePickup: datepickup, livreurPickup: livreur._id},
            {new: true} // Set the { new: true } option to get the updated document as a result
        );
        return res.status(200).json({message: 'Colis picked at', datepickup});
    } catch (error) {
        console.error('Error updating colis status:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};
exports.calculateTotalAmountForLivreur = async (req, res) => {
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
        const livreur = await livreurModel.findOne({ userId });

        // Find all "livré" colis for the specific livreur
        const livresColis = await colisModel.find({ livreur: livreur.id, status: 'livré' });

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
exports.getLivreurLivredColis = async (req, res) => {
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
        const livreur = await livreurModel.findOne({ userId });

        // Find all "livré" colis for the specific livreur
        const livredColis = await colisModel.find({ livreur: livreur.id, status: 'livré' });

        res.status(200).json(livredColis);
    } catch (error) {
        console.error('Error fetching livreur livré colis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getColisEnAttenteForLivreur = async (req, res) => {
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
        const livreur = await livreurModel.findOne({ userId });

        // Find all "en attente" colis for the specific livreur to pick up
        const enAttenteColis = await colisModel.find({ livreurPickup: livreur.id, status: 'en attente' });

        // Map and populate Fournisseur information for each colis
        const colisWithFournisseurInfo = await Promise.all(enAttenteColis.map(async (colis) => {
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
        console.error('Error fetching colis en attente for livreur:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateColisStatus = async (req, res) => {
    try {
        const { colisIds } = req.body; // Assuming you're passing an array of colis IDs in the request body
        // Update the status of multiple colis to "livré et payé"
        await colisModel.updateMany({ _id: { $in: colisIds } }, { status: 'livré et payé' });

        res.status(200).json({ message: 'Colis statuses updated successfully' });
    } catch (error) {
        console.error('Error updating colis statuses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


