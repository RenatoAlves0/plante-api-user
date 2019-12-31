const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const AlertaUmidade = require('../models/alertaUmidade')

router.post('/', (req, res, next) => {
    const alertaUmidade = new AlertaUmidade({
        _id: new mongoose.Types.ObjectId(),
        data: req.body.data,
        valor: req.body.valor,
        plantacao: req.body.plantacao,
        usuario: req.body.usuario
    })

    alertaUmidade.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: alertaUmidade._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    AlertaUmidade.find()
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})


router.route('/usuario_plantacao/:usuarioId/:plantacaoId')
    .get(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(docs => {
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                res.status(200).json(alertas)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

    router.route('/anos/:usuarioId/:plantacaoId')
    .get(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(docs => {
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                let anos = [...new Set(alertas.map(x => x.data.getFullYear() + ''))]
                res.status(200).json(anos)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.route('/meses/:usuarioId/:plantacaoId/:ano')
    .get(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(docs => {
                let ano = []
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                alertas.forEach(item => {
                    if (item.data.getFullYear() == req.params.ano) ano.push(item)
                })
                let meses = [...new Set(ano.map(x => x.data.getMonth() + 1 + ''))]
                res.status(200).json(meses)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.route('/dias/:usuarioId/:plantacaoId/:ano/:mes')
    .get(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(docs => {
                let mes = []
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId && obj.plantacao == req.params.plantacaoId)
                alertas.forEach(item => {
                    if (item.data.getFullYear() == req.params.ano &&
                        item.data.getMonth() + 1 == req.params.mes) mes.push(item)
                })
                let dias = [...new Set(mes.map(x => x.data.toDateString()))]
                res.status(200).json(dias)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.route('/porDia/:usuarioId/:plantacaoId/:dia')
    .get(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(docs => {
                let alertas = docs.filter(obj => obj.usuario == req.params.usuarioId
                    && obj.plantacao == req.params.plantacaoId
                    && obj.data.toDateString() == req.params.dia)
                res.status(200).json(alertas)
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    })

router.get('/:alertaUmidadeId', (req, res, next) => {
    AlertaUmidade.findById(req.params.alertaUmidadeId)
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:alertaUmidadeId', (req, res, next) => {
    AlertaUmidade.update({ _id: req.params.alertaUmidadeId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.route('/deletar_por_data/:array')
    .delete(function (req, res) {
        AlertaUmidade.find()
            .exec()
            .then(objs => {
                JSON.parse(req.params.array).forEach(item => {
                    let alertas = objs.filter(obj => JSON.stringify(obj.data).split('T')[0] == '"' + item)
                    alertas.forEach(alerta => {
                        AlertaUmidade.deleteOne({ _id: alerta._id }).exec()
                            .then(() => { res.status(200).json({ message: "Deletado com sucesso!" }) })
                            .catch(err => { res.status(500).json({ error: err }) })
                    })
                })
            })
            .catch(err => { res.status(500).json({ error: err }) })
    })

router.delete('/:alertaUmidadeId', (req, res, next) => {
    AlertaUmidade.deleteOne({ _id: req.params.alertaUmidadeId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router