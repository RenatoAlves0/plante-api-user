const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const AlertaTemperatura = require('../models/alertaTemperatura')

router.post('/', (req, res, next) => {
    const alertaTemperatura = new AlertaTemperatura({
        _id: new mongoose.Types.ObjectId(),
        data: req.body.data,
        valor: req.body.valor,
        plantacao: req.body.plantacao,
        usuario: req.body.usuario
    })

    alertaTemperatura.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: alertaTemperatura._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    AlertaTemperatura.find()
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})


router.route('/usuario_plantacao/:usuarioId/:plantacaoId')
    .get(function (req, res) {
        AlertaTemperatura.find()
            .exec()
            .then(docs => {
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                res.status(200).json(alertas)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/:alertaTemperaturaId', (req, res, next) => {
    AlertaTemperatura.findById(req.params.alertaTemperaturaId)
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:alertaTemperaturaId', (req, res, next) => {
    AlertaTemperatura.update({ _id: req.params.alertaTemperaturaId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:alertaTemperaturaId', (req, res, next) => {
    AlertaTemperatura.remove({ _id: req.params.alertaTemperaturaId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router