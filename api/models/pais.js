const mongoose = require('mongoose')

const pais = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    sigla: { type: String, required: true }
})

module.exports = mongoose.model('Pais', pais)