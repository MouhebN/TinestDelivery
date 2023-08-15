const mongoose = require('mongoose');
const colisSchema = new mongoose.Schema(
    {
        fournisseur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fournisseur',
            required: true
        },
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
            required: true
        },
        prenomClient: {
            type: String,
            required: true
        },
        livreur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Livreur',
            required: false
        },
        status: {
            type: String,
            enum: ['en attente', 'en stock', 'en cours', 'retour en stock', 'livré', 'en pickup',
                'annulé', 'retour au fournisseur', 'livré et payé', 'payé'],
            required: false
        },
        retourCount: {
            type: Number,
            default: 0
        },
        date_creation:
            {
                type: Date,
                required: true
            },
        prix:
            {
                type: Number,
                required: true
            },
        typeDePayment:
            {
                type: String,
                required: false
            },
        largeur:
            {
                type: Number,
                required: false
            },
        hauteur:
            {
                type: Number,
                required: false
            },
        typeColis:
            {
                type: String,
                required: false
            },
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',
            required: false,
        },
        dateEntredStock: {
            type: Date,
            required: false

        }, datePickup: {
            type: Date,
            required: false

        }, dateLivraison: {
            type: Date,
            required: false
        },
        livreurPickup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Livreur',
            required: false
        }
    }
)

module.exports = mongoose.model('colis', colisSchema);
