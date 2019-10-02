const mqtt = require('mqtt')
const client_mqtt = mqtt.connect('mqtt://test.mosquitto.org')
const topico_sensores_c = 'plante_sensores_c.'
const topico_regador_c = 'plante_regador_c.'
const Usuario = require('../models/usuario')
var usuarios = []

client_mqtt.on('connect', async () => {
    await Usuario.find()
        .exec()
        .then(docs => docs.forEach(doc => {
            usuarios.push(doc._id)
            client_mqtt.subscribe(topico_sensores_c + doc._id)
        }))
        .catch(err => { console.log(err) })
    console.log(usuarios)
})

client_mqtt.on('message', (topic, message) => {
    client_mqtt.publish(topico_regador_c + topic.split('.')[1], 'Mensagem MQTT!')
    console.log(message.toString())
})

module.exports = client_mqtt