const mqtt = require('mqtt')
const axios = require('axios')
const client_mqtt = mqtt.connect('mqtt://test.mosquitto.org')
const topico_sensores_c = 'plante_sensores_c.'
const topico_regador_c = 'plante_regador_c.'
const topico_alertas = 'plante_alertas.'
const plantacao_principal = require('../models/plantacaoPrincipal')
let plantacoes = [], plantacoes_aux = []

client_mqtt.on('connect', async () => {
    let plantacao_aux = { usuario: '', plantacao: { t0: '', t1: '', u0: '', u1: '', uS0: '', uS1: '' } }
    await plantacao_principal.find()
        .populate('plantacao')
        .exec()
        .then(docs => { plantacoes_aux = docs })
    plantacoes_aux.forEach(async item => {
        await axios.get('https://plante-api.herokuapp.com/plantas/' + item.plantacao.cultura)
            .then(data => {
                plantacao_aux.usuario = item.usuario
                plantacao_aux.plantacao.t0 = data.data.clima.temperaturaMinima
                plantacao_aux.plantacao.t1 = data.data.clima.temperaturaMaxima
                plantacao_aux.plantacao.u0 = data.data.clima.umidadeMinima
                plantacao_aux.plantacao.u1 = data.data.clima.umidadeMaxima
                plantacao_aux.plantacao.uS0 = data.data.solo.umidadeMinima
                plantacao_aux.plantacao.uS1 = data.data.solo.umidadeMaxima
            })
        await plantacoes.push(plantacao_aux)
        client_mqtt.subscribe(topico_sensores_c + item.usuario)
    })
})

regar = async (topic, message) => {
    let p = await plantacoes.find(obj => obj.usuario == topic)
    if (message.uS < p.plantacao.uS0)
        client_mqtt.publish(topico_regador_c + topic, '1')
    else {
        client_mqtt.publish(topico_regador_c + topic, '0')
    }
}

alertas = async (topic, message) => {
    let m = { t: '', u: '', uS: '', l: '', c: '' }
    let p = await plantacoes.find(obj => obj.usuario == topic)
    if (message.t < p.plantacao.t0)
        m.t = (p.plantacao.t0 - message.t).toFixed(1) + ' ºC\nabaixo'
    else if (message.t > p.plantacao.t1)
        m.t = (message.t - p.plantacao.t1).toFixed(1) + ' ºC\nacima'

    if (message.u < p.plantacao.u0)
        m.u = (p.plantacao.u0 - message.u).toFixed(1) + ' %\nabaixo'
    else if (message.u > p.plantacao.u1)
        m.u = (message.u - p.plantacao.u1).toFixed(1) + ' %\nacima'

    if (message.uS < p.plantacao.uS0)
        m.uS = (p.plantacao.uS0 - message.uS).toFixed(1) + ' %\nabaixo'
    else if (message.uS > p.plantacao.uS1)
        m.uS = (message.uS - p.plantacao.uS1).toFixed(1) + ' %\nacima'
    client_mqtt.publish(topico_alertas + topic, JSON.stringify(m))
}

client_mqtt.on('message', (topic, message) => {
    if (topic.split('.')[0] + '.' == topico_sensores_c) {
        regar(topic.split('.')[1], JSON.parse(message.toString()))
        alertas(topic.split('.')[1], JSON.parse(message.toString()))
    }
})