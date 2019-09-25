const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const PlantacaoPrincipal = require('../models/plantacaoPrincipal')

router.post('/', (req, res, next) => {
    const plantacaoPrincipal = new PlantacaoPrincipal({
        _id: new mongoose.Types.ObjectId(),
        plantacao: req.body.plantacao,
        usuario: req.body.usuario
    })

    plantacaoPrincipal.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: plantacaoPrincipal._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    PlantacaoPrincipal.find()
        .populate('plantacao usuario')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.route('/usuario/:usuarioId')
    .get(function (req, res) {
        PlantacaoPrincipal.find()
            .exec()
            .then(async (docs) => {
                let plantacoes = []
                plantacoes.push(await docs.filter((obj) => obj.usuario == req.params.usuarioId))
                res.status(200).json(plantacoes[0])
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/:plantacaoPrincipalId', (req, res, next) => {
    PlantacaoPrincipal.findById(req.params.plantacaoPrincipalId)
        .populate('plantacao usuario')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:plantacaoPrincipalId', (req, res, next) => {
    PlantacaoPrincipal.update({ _id: req.params.plantacaoPrincipalId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:plantacaoPrincipalId', (req, res, next) => {
    PlantacaoPrincipal.remove({ _id: req.params.plantacaoPrincipalId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router