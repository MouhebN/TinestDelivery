const mongoose = require('mongoose');


const fournisseurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence',
        required: true
    }
})
module.exports = mongoose.model('fournisseurs', fournisseurSchema);