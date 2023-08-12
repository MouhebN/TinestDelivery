const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    agence: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence',
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})
module.exports = mongoose.model('users', userSchema);