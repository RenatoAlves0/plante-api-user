const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Irrigacao = require('../models/irrigacao')

router.post('/', (req, res, next) => {
    const irrigacao = new Irrigacao({
        _id: new mongoose.Types.ObjectId(),
        inicio: req.body.inicio,
        fim: req.body.fim,
        plantacao: req.body.plantacao,
        usuario: req.body.usuario
    })

    irrigacao.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: irrigacao._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Irrigacao.find()
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})


router.route('/usuario_plantacao/:usuarioId/:plantacaoId')
    .get(function (req, res) {
        Irrigacao.find()
            .exec()
            .then(docs => {
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                res.status(200).json(alertas)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/:irrigacaoId', (req, res, next) => {
    Irrigacao.findById(req.params.irrigacaoId)
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:irrigacaoId', (req, res, next) => {
    Irrigacao.update({ _id: req.params.irrigacaoId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:irrigacaoId', (req, res, next) => {
    Irrigacao.remove({ _id: req.params.irrigacaoId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router