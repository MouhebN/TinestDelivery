const getAgenceIdFromToken = require("../Utils/getAgenceIdFromToken");
const Facture = require("../Models/facture");

exports.ajouterFacture = async (req, res) => {
    try {
    const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const newFacture = new Facture({
            agence: agenceId,
            purchases: req.body.purchases,
            totalAmount: req.body.totalAmount,
            date: new Date(),
            etat:'waiting'
        });
        await newFacture.save();
        res.json({ message: 'Facture created successfully' });
    } catch (error) {
        console.error('Error creating facture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listFactures = async (req, res) => {
    try {
        const agenceId = await getAgenceIdFromToken(req.headers['x-access-token']);
        const factures = await Facture.find({ agence: agenceId });
        res.json(factures);
    } catch (error) {
        console.error('Error fetching factures:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};