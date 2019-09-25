const mongoose = require('mongoose')

const plantacao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    cultura: { type: String, required: true }, //pegar o _id da planta do 'plante-api'
    localizacao: { type: String, required: true },
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cor: { type: Number, required: false, default: 0 },
    principal: { type: Boolean, required: false, default: false },
})

module.exports = mongoose.model('Plantacao', plantacao)