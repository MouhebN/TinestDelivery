const mongoose = require('mongoose');

const echangeColisSchema = new mongoose.Schema({
  colis1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colis', // Référence au modèle de colis si vous avez un modèle pour les colis
    required: true,
  },
  colis2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colis', // Référence au modèle de colis si vous avez un modèle pour les colis
    required: true,
  },
  dateEchange: {
    type: Date,
    default: Date.now,
  },
  // Autres champs pertinents pour votre modèle d'échange de colis
});

const EchangeColisModel = mongoose.model('EchangeColis', echangeColisSchema);

module.exports = EchangeColisModel;
