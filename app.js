const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const cidadeRoutes = require('./api/routes/cidades')
const estadoRoutes = require('./api/routes/estados')
const loginRoutes = require('./api/routes/logins')
const paisRoutes = require('./api/routes/paiss')
const plantacaoRoutes = require('./api/routes/plantacaos')
const usuarioRoutes = require('./api/routes/usuarios')

mongoose.connect('mongodb+srv://plante-api-user:' +
    process.env.MONGO_ATLAS_PW +
    '@plante-api-user-mqlr4.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true }
)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

//Rotas
app.use('/cidades', cidadeRoutes)
app.use('/estados', estadoRoutes)
app.use('/logins', loginRoutes)
app.use('/paiss', paisRoutes)
app.use('/plantacaos', plantacaoRoutes)
app.use('/usuarios', usuarioRoutes)

app.use((req, res, next) => {
    const error = new Error("Não encontrato!")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app