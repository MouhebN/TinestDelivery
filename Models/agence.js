const mongoose = require('mongoose');


const agenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    livreurs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livreur'
    }],
    magasiniers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Magasinier'
    }]
});

module.exports = mongoose.model('Agences', agenceSchema);
