const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Login = require('../models/login')

router.route('/logar')
    .get(function (req, res) {
        Login.findOne({ login: req.query.login, senha: req.query.senha })
            .exec()
            .then(doc => {
                if (doc._id)
                    res.status(200).json(doc)
                else
                    res.status(404).json({})
            })
            .catch(() => { res.status(404).json({}) })
    })

router.post('/', (req, res, next) => {
    const login = new Login({
        _id: new mongoose.Types.ObjectId(),
        login: req.body.login,
        senha: req.body.senha,
        usuario: req.body.usuario
    })

    login.save()
        .then(result => { res.status(201).json({ message: "Salvo com sucesso!", _id: login._id }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/', (req, res, next) => {
    Login.find()
        .populate('usuario')
        .exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.get('/:loginId', (req, res, next) => {
    Login.findById(req.params.loginId)
        .populate('usuario')
        .exec()
        .then(doc => {
            if (doc) { res.status(200).json(doc) }
            else res.status(404).json({ message: 'Registro não encontrado!' })
        })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.put('/:loginId', (req, res, next) => {
    Login.update({ _id: req.params.loginId }, { $set: req.body }).exec()
        .then(result => { res.status(200).json({ message: "Editado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

router.delete('/:loginId', (req, res, next) => {
    Login.remove({ _id: req.params.loginId }).exec()
        .then(result => { res.status(200).json({ message: "Deletado com sucesso!" }) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router