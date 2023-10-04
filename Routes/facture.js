const express = require('express');
const router = express.Router();
const factureController = require('../Controllers/factureController');
const authenticateToken = require('../authMiddelware'); // Import the middleware

// Protected routes (require authentication)
router.post('/ajouterFacture', authenticateToken, factureController.ajouterFacture);
router.get('/listFactures', authenticateToken, factureController.listFactures);



module.exports = router;