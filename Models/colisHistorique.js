const mongoose = require('mongoose');

const colisHistoriqueSchema = new mongoose.Schema({
  colis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colis', // Référence au modèle de colis existant
    required: true,
  },
  statut: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ColisHistorique', colisHistoriqueSchema);
