const express = require('express');
const router = express.Router();
const chefController = require('../Controllers/chefController');
const authenticateToken = require('../authMiddelware'); // Import the middleware


router.get('/getLivreurLivredColis', authenticateToken, chefController.getLivreurColis);
router.get('/getLivreurTotal', authenticateToken, chefController.calculateTotalAmountForLivreur);


module.exports = router;