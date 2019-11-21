const mongoose = require('mongoose')

const alertaUmidadeSolo = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    data: { type: Date, required: true },
    valor: { type: Number, required: true },
    plantacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Plantacao', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
})

module.exports = mongoose.model('AlertaUmidadeSolo', alertaUmidadeSolo)