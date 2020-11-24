const mongoose = require('mongoose')

const login = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: { type: String, required: true },
    senha: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    admin: { type: Boolean, default: false }
})

module.exports = mongoose.model('Login', login)