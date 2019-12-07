const mongoose = require('mongoose')

const keepAlive = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
})

module.exports = mongoose.model('KeepAlive', keepAlive)