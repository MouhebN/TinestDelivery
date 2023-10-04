const express = require('express');
const router = express.Router();
const EchangeColisModel = require('../Models/echangeColis');

// Créer un nouvel échange de colis
router.post('/echangerColis', async (req, res) => {
  try {
    const { colisId1, colisId2 } = req.body;

    // Créez un nouvel échange de colis en utilisant le modèle
    const echangeColis = new EchangeColisModel({
      colis1: colisId1,
      colis2: colisId2,
    });

    // Enregistrez l'échange de colis dans la base de données
    const nouveauEchangeColis = await echangeColis.save();

    res.status(201).json(nouveauEchangeColis);
  } catch (error) {
    console.error('Erreur lors de la création de l\'échange de colis :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir un échange de colis par ID
router.get('/echangerColis/:id', async (req, res) => {
  try {
    const echangeColis = await EchangeColisModel.findById(req.params.id);

    if (!echangeColis) {
      return res.status(404).json({ error: 'Échange de colis non trouvé' });
    }

    res.status(200).json(echangeColis);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'échange de colis :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Obtenir la liste de tous les échanges de colis
router.get('/echangerColis', async (req, res) => {
  try {
    const echangesColis = await EchangeColisModel.find();

    res.status(200).json(echangesColis);
  } catch (error) {
    console.error('Erreur lors de la récupération des échanges de colis :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
