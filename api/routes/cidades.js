const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Cidade = require('../models/cidade')

router.post('/', (req, res, next) => {
    const cidade = new Cidade({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        estado: req.body.estado
    })

    cidade.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: cidade._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Cidade.find()
        .sort({ nome: 'asc' })
        .populate('estado')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:cidadeId', (req, res, next) => {
    Cidade.findById(req.params.cidadeId)
        .populate('estado')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.route('/estado/:estadoId')
    .get(function (req, res) {
        Cidade.find()
            .sort({ nome: 'asc' })
            .exec()
            .then(async (docs) => {
                let cidades = docs.filter((obj) => obj.estado == req.params.estadoId)
                res.status(200).json({ cidades })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/cidadeId', (req, res, next) => {
    Cidade.findById(req.params.cidadeId)
        .populate('estado')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:cidadeId', (req, res, next) => {
    Cidade.update({ _id: req.params.cidadeId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:cidadeId', (req, res, next) => {
    Cidade.remove({ _id: req.params.cidadeId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router