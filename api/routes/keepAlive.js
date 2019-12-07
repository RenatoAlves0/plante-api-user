const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const KeepAlive = require('../models/keepAlive')

router.get('/', (req, res, next) => {
    KeepAlive.find().exec()
        .then(docs => { res.status(200).json(docs) })
        .catch(err => { res.status(500).json({ error: err }) })
})

module.exports = router