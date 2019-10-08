const mqtt = require('mqtt')
const axios = require('axios')
const client_mqtt = mqtt.connect('mqtt://test.mosquitto.org')
const topico_sensores_c = 'plante_sensores_c.'
const topico_regador_c = 'plante_regador_c.'
const PlantacaoPrincipal = require('../models/plantacaoPrincipal')
let plantacoes = [], plantacoes_aux = []

client_mqtt.on('connect', async () => {
    let plantacao_aux = {
        usuario: undefined, plantacao: {
            t0: undefined,
            t1: undefined,
            u0: undefined,
            u1: undefined,
            uS0: undefined,
            uS1: undefined
        }
    }
    await PlantacaoPrincipal.find()
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
                console.log(plantacao_aux)
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

client_mqtt.on('message', (topic, message) => {
    regar(topic.split('.')[1], JSON.parse(message.toString()))
})