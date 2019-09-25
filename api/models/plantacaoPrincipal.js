const mongoose = require('mongoose')

const plantacaoPrincipal = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    plantacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Plantacao', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
})

module.exports = mongoose.model('PlantacaoPrincipal', plantacaoPrincipal)