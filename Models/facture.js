const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence',
        required: true,
    },
    purchases: [{
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    etat: {
        type: String,
        enum :['accepted', 'not accepted','waiting'] ,
        required: false
    },
});

const Facture = mongoose.model('Factures', factureSchema);
module.exports = Facture;
