const mongoose = require('mongoose')

const irrigacao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    inicio: { type: Date, required: true },
    fim: { type: Date, required: true },
    plantacao: { type: mongoose.Schema.Types.ObjectId, ref: 'Plantacao', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
})

module.exports = mongoose.model('Irrigacao', irrigacao)