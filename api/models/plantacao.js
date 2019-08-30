const mongoose = require('mongoose')

const plantacao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    cultura: { type: String, required: true }, //pegar o _id da planta do 'plante-api'
    localizacao: { type: String, required: false },
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
})

module.exports = mongoose.model('Plantacao', plantacao)