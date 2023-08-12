const express = require('express');
const router = express.Router();
const agenceController = require('../Controllers/agenceController');
const authenticateToken = require('../authMiddelware'); // Import the middleware

// Protected routes (require authentication)
router.post('/ajouterAgence', authenticateToken, agenceController.ajouterAgence);
router.post('/:id/modifierAgence', authenticateToken, agenceController.modifierAgence);
router.get('/:id/supprimerAgence', authenticateToken, agenceController.supprimerAgence);
router.get('/listerAgences', authenticateToken, agenceController.listerAgences);

module.exports = router;
