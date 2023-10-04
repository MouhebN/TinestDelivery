const HistoriqueColis = require('../Models/colisHistorique'); 

// Fonction pour enregistrer l'historique d'un colis
exports.enregistrerHistoriqueColis = async (colisId, statut) => {
    try {
        // Créez une nouvelle instance de l'historique du colis
        const historique = new HistoriqueColis({
            colis: colisId,
            statut: statut
        });

        // Enregistrez l'historique
        await historique.save();
    } catch (error) {
        throw error;
    }
};

// Fonction pour obtenir l'historique d'un colis spécifique
exports.getHistoriqueColis = async (colisId) => {
    try {
        // Recherchez l'historique en fonction de l'ID du colis
        const historique = await HistoriqueColis.find({ colis: colisId });
        return historique;
    } catch (error) {
        throw error;
    }
};
