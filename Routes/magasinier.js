const express = require('express');
const magasinierController = require("../Controllers/magasinierController");
const authenticateToken = require('../authMiddelware'); // Import the authentication middleware
const router = express.Router();

// Apply the authentication middleware to protected routes
router.post('/ajouterMagasinier', authenticateToken, magasinierController.ajouterMagasinier);
router.post('/:id/modifierMagasinier', authenticateToken, magasinierController.modifierMagasinier);
router.get('/:id/supprimerMagasinier', authenticateToken, magasinierController.supprimerMagasinier);
router.get('/listerMagasiniers', authenticateToken, magasinierController.listerMagasiniers);

module.exports = router;
