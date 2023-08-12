
const express = require('express');
const router = express.Router();
const stockController = require('../Controllers/stockController');
const authenticateToken = require("../authMiddelware");



router.post('/ajouterStock',authenticateToken, stockController.ajouterStock);
router.post('/:id/modifierStock',  authenticateToken,stockController.modifierStock);
router.get('/:id/supprimerStock',  authenticateToken,stockController.supprimerStock);
router.get('/listerStocks',  authenticateToken,stockController.listerStocks);
router.get('/getNumberColisEnStock', authenticateToken, stockController.getNumberColisEnStock);///
router.get('/getNumberColisEnCours',  authenticateToken,stockController.getNumberColisEnCours);///
router.get('/getNumberColisEnRetour',  authenticateToken,stockController.getNumberColisEnRetour);///
router.post('/payementColis', authenticateToken, stockController.payementColis);
router.post('/retourAuFournisseur',authenticateToken,stockController.retourAuFournisseur);

module.exports = router;
