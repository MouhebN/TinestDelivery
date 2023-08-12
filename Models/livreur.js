const mongoose = require('mongoose');


const livreurSchema = new mongoose.Schema({
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
    password: { type: String, required: false },
    role: { type: String, required: false },
    username: { type: String, required: false },

    address: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    matricule_voiture: {
        type: String,
        required: false
    },
    telephone: {
        type: String,
        required: false
    },
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence',
        required: true
    }, colis: [
        {
            destination: {
                type: String,
                required: true
            },
            num_client: {
                type: Number,
                required: true
            },
            nomClient: {
                type: String,
                required: false
            }, prenomClient: {
                type: String,
                required: false
            },
            status: {
                type: String,
                enum: ['en attente', 'en stock', 'en cours','retour en stock','livré','en pickup',
                    'annulé','retour au fournisseur','livré et payé'],
                required: true
            },
            retourCount: {
                type: Number,
                default: 0
            },
            date_creation: {
                type: Date,
                required: true
            },
            prix: {
                type: Number,
                required: true
            },
            typeDePayment: {
                type: String,
                required: false
            },
            largeur: {
                type: Number,
                required: false
            },
            hauteur: {
                type: Number,
                required: false
            },
            typeColis: {
                type: String,
                required: false
            }, dateEntredStock:{
                type: Date,
                required: false

            }, datePickup:{
                type: Date,
                required: false

            }, dateLivraison:{
                type: Date,
                required: false
            },
            livreurPickup: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Livreur',
                required: false
            }
        }
    ],
})
module.exports = mongoose.model('livreurs', livreurSchema);