const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Estado = require('../models/estado')

router.post('/', (req, res, next) => {
    const estado = new Estado({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        sigla: req.body.sigla,
        pais: req.body.pais
    })

    estado.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Estado.find()
        .populate('pais')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:estadoId', (req, res, next) => {
    Estado.findById(req.params.estadoId)
        .populate('pais')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:estadoId', (req, res, next) => {
    Estado.update({ _id: req.params.estadoId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:estadoId', (req, res, next) => {
    Estado.remove({ _id: req.params.estadoId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router