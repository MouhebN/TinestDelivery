const express = require('express');
const router = express.Router();
const authenticateToken = require('../authMiddelware');
const historiqueColisController = require('../Controllers/historiqueColisController');
const colisController = require ('../Controllers/colisController');
// Route pour ajouter un colis avec enregistrement d'historique
// Route pour enregistrer l'historique du colis
router.post('/historique-colis/colis', authenticateToken, async (req, res) => {
    try {
        const { colis, statut } = req.body;

        // Validez les données ici, par exemple, assurez-vous que "colis" et "statut" sont présents dans la requête

        // Appelez la fonction pour enregistrer l'historique du colis
        await historiqueColisController.enregistrerHistoriqueColis(colis, statut);

        res.status(200).json({ message: 'Historique du colis enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'historique du colis :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});


// Route pour obtenir l'historique d'un colis spécifique
router.get('/historique-colis/:colisId',  authenticateToken, async (req, res) => {
    try {
        const colisId = req.params.colisId;
        console.log('Colis ID:', colisId); // Ajoutez ceci pour déboguer

        // Obtenez l'historique du colis en utilisant le contrôleur
        const historique = await historiqueColisController.getHistoriqueColis(colisId);

        res.status(200).json(historique);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique du colis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});


module.exports = router;
