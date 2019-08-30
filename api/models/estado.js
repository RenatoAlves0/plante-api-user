const mongoose = require('mongoose')

const estado = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    sigla: { type: String, required: true },
    pais: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais', required: true }
})

module.exports = mongoose.model('Estado', estado)