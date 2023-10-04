const mongoose = require('mongoose');


const fournisseurSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    address: {
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
    },
    password:
        { type: String, required: false },
    role:
        { type: String, required: false },
    username:
        { type: String, required: false },
})
module.exports = mongoose.model('fournisseurs', fournisseurSchema);