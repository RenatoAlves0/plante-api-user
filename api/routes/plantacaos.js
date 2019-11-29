const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Plantacao = require('../models/plantacao')

router.post('/', (req, res, next) => {
    const plantacao = new Plantacao({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        cultura: req.body.cultura,
        localizacao: req.body.localizacao,
        cidade: req.body.cidade,
        usuario: req.body.usuario,
        cor: req.body.cor
    })

    plantacao.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: plantacao._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Plantacao.find()
        .sort({ nome: 'asc' })
        .populate('cidade usuario')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.route('/usuario/:usuarioId')
    .get(function (req, res) {
        Plantacao.find()
            .sort({ nome: 'asc' })
            .populate('cidade')
            .exec()
            .then(docs => {
                let plantacoes = docs.filter(obj => obj.usuario == req.params.usuarioId)
                res.status(200).json(plantacoes)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/:plantacaoId', (req, res, next) => {
    Plantacao.findById(req.params.plantacaoId)
        .populate('cidade usuario')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:plantacaoId', (req, res, next) => {
    Plantacao.update({ _id: req.params.plantacaoId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:plantacaoId', (req, res, next) => {
    Plantacao.deleteOne({ _id: req.params.plantacaoId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router