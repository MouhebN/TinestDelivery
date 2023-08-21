const express = require('express');
const router = express.Router();
const chefController = require('../Controllers/chefController');
const authenticateToken = require('../authMiddelware'); // Import the middleware


router.get('/getLivreurLivredColis', authenticateToken, chefController.getLivreurColis);
router.get('/getLivreurTotal', authenticateToken, chefController.calculateTotalAmountForLivreur);
router.get('/getColisEnAttente', authenticateToken, chefController.getColisEnAttente);
router.get('/getColisAgence', authenticateToken, chefController.getColisAgence);
router.get('/getStatusData', authenticateToken, chefController.getStatus);
router.get('/getAverageDelivery', authenticateToken, chefController.timeDiff);
router.get('/getLivredEtPayeColisCountOverTime', authenticateToken, chefController.getLivredEtPayeColisCountOverTime);
router.get('/getTopLivreur', authenticateToken, chefController.getTopLivreurs);
router.get('/getColisVolumeByFournisseur', authenticateToken, chefController.getColisVolumeByFournisseur);








module.exports = router;