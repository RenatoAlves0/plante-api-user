const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Pais = require('../models/pais')

router.post('/', (req, res, next) => {
    const pais = new Pais({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        sigla: req.body.sigla
    })

    pais.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: pais._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Pais.find()
        .sort({ nome: 'asc' })
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:paisId', (req, res, next) => {
    Pais.findById(req.params.paisId)
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:paisId', (req, res, next) => {
    Pais.update({ _id: req.params.paisId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:paisId', (req, res, next) => {
    Pais.deleteOne({ _id: req.params.paisId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router