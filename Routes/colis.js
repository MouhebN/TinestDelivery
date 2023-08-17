const express = require('express');
const router = express.Router();
const colisController = require('../Controllers/colisController');
const authenticateToken = require('../authMiddelware');



router.post('/ajouterColis',  colisController.ajouterColis);
router.post('/:id/modifierColis', authenticateToken, colisController.modifierColis);
router.get('/:id/supprimerColis', authenticateToken, colisController.supprimerColis);
router.get('/listerColis', authenticateToken, colisController.listerColis);


// magasinier
router.get('/listerLivreurAgence',authenticateToken,colisController.listerLivreurAgence);///
router.get('/getLivreur/:id',  authenticateToken,colisController.getLivreur);
router.post('/retournerColis',  authenticateToken,colisController.retourColisAuStock);///
router.get('/getMultipleLivreur', authenticateToken,colisController.getMultipleLivreur);///
router.get('/getAllColisEnStock',  authenticateToken,colisController.getAllColisEnStock);///
router.post('/ajouterColisAuStock',  authenticateToken,colisController.ajouterColisAuStock);//
router.post('/attribuerColis',  authenticateToken,colisController.attribuerColisAuLivreur);//
router.get('/getStockColis', authenticateToken,colisController.getAllColisFromStock);///
router.get('/LivreurAmount', authenticateToken,colisController.calculateTotalAmountForLivreur);///
router.get('/LivreurColisLivre', authenticateToken,colisController.getLivreurLivredColis);///
router.get('/getColisEnAttenteForLivreur', authenticateToken,colisController.getColisEnAttenteForLivreur);///
router.put('/updateColisStatus', colisController.updateColisStatus);




// livreur
router.post('/scanPickup', authenticateToken, colisController.pickUpColis);///

module.exports = router;











module.exports =router ;