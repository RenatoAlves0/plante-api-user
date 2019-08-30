const mongoose = require('mongoose')

const usuario = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    nascimento: { type: Date, required: true }
})

module.exports = mongoose.model('Usuario', usuario)