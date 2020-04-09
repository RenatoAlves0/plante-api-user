const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../models/usuario')

router.post('/', (req, res, next) => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        cidade: req.body.cidade,
    })

    usuario.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: usuario._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Usuario.find()
        .sort({ nome: 'asc' })
        .populate('cidade')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:usuarioId', (req, res, next) => {
    Usuario.findById(req.params.usuarioId)
        .populate('cidade')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:usuarioId', (req, res, next) => {
    Usuario.update({ _id: req.params.usuarioId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:usuarioId', (req, res, next) => {
    Usuario.deleteOne({ _id: req.params.usuarioId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router