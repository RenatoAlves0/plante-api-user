const mqtt = require('mqtt')
const axios = require('axios')
const mongoose = require('mongoose')
const client_mqtt = mqtt.connect('mqtt://test.mosquitto.org')
const topico_sensores_c = 'plante_sensores_c.'
const topico_regador_c = 'plante_regador_c.'
const topico_alertas = 'plante_alertas.'
const PlantacaoPrincipal = require('../models/plantacaoPrincipal')
const AlertaTemperatura = require('../models/alertaTemperatura')
const AlertaUmidade = require('../models/alertaUmidade')
const AlertaUmidadeSolo = require('../models/alertaUmidadeSolo')
const AlertaLuminosidade = require('../models/alertaLuminosidade')
const Irrigacao = require('../models/irrigacao')
let plantacoes = [], plantacoes_aux = [], irrigacoes = []

client_mqtt.on('connect', async () => {
    let plantacao_aux = { usuario: '', plantacao: { _id: '', t0: '', t1: '', u0: '', u1: '', uS0: '', uS1: '', l0: '', l1: '' } }
    await PlantacaoPrincipal.find()
        .populate('plantacao')
        .exec()
        .then(docs => { plantacoes_aux = docs })
    plantacoes_aux.forEach(async item => {
        await axios.get('https://plante-api.herokuapp.com/plantas/' + item.plantacao.cultura)
            .then(data => {
                if (data.data.luz.intensidade == 'Sombra') {
                    plantacao_aux.plantacao.l0 = 0
                    plantacao_aux.plantacao.l1 = 20
                } else if (data.data.luz.intensidade == 'Fraca') {
                    plantacao_aux.plantacao.l0 = 20
                    plantacao_aux.plantacao.l1 = 40
                } else if (data.data.luz.intensidade == 'Média') {
                    plantacao_aux.plantacao.l0 = 40
                    plantacao_aux.plantacao.l1 = 70
                } else {
                    plantacao_aux.plantacao.l0 = 70
                    plantacao_aux.plantacao.l1 = 100
                }

                plantacao_aux.usuario = item.usuario
                plantacao_aux.plantacao._id = item.plantacao._id
                plantacao_aux.plantacao.t0 = data.data.clima.temperaturaMinima
                plantacao_aux.plantacao.t1 = data.data.clima.temperaturaMaxima
                plantacao_aux.plantacao.u0 = data.data.clima.umidadeMinima
                plantacao_aux.plantacao.u1 = data.data.clima.umidadeMaxima
                plantacao_aux.plantacao.uS0 = data.data.solo.umidadeMinima
                plantacao_aux.plantacao.uS1 = data.data.solo.umidadeMaxima
            })
        plantacoes.push(plantacao_aux)
        client_mqtt.subscribe(topico_sensores_c + item.usuario)
    })
})

saveAlertaTemperatura = (valor, usuario, plantacao) => {
    const alertaTemperatura = new AlertaTemperatura({
        _id: new mongoose.Types.ObjectId(),
        data: Date.now(),
        valor: valor,
        plantacao: plantacao,
        usuario: usuario
    })

    alertaTemperatura.save()
        .then(() => console.log('Alerta de Temperatura salvo com sucesso!, id: ' + alertaTemperatura._id))
        .catch(err => console.log(err))
}

saveAlertaUmidade = (valor, usuario, plantacao) => {
    const alertaUmidade = new AlertaUmidade({
        _id: new mongoose.Types.ObjectId(),
        data: Date.now(),
        valor: valor,
        plantacao: plantacao,
        usuario: usuario
    })

    alertaUmidade.save()
        .then(() => console.log('Alerta de Umidade salvo com sucesso!, id: ' + alertaUmidade._id))
        .catch(err => console.log(err))
}

saveAlertaUmidadeSolo = (valor, usuario, plantacao) => {
    const alertaUmidadeSolo = new AlertaUmidadeSolo({
        _id: new mongoose.Types.ObjectId(),
        data: Date.now(),
        valor: valor,
        plantacao: plantacao,
        usuario: usuario
    })

    alertaUmidadeSolo.save()
        .then(() => console.log('Alerta de Umidade do Solo salvo com sucesso!, id: ' + alertaUmidadeSolo._id))
        .catch(err => console.log(err))
}

saveAlertaLuminosidade = (valor, usuario, plantacao) => {
    const alertaLuminosidade = new AlertaLuminosidade({
        _id: new mongoose.Types.ObjectId(),
        data: Date.now(),
        valor: valor,
        plantacao: plantacao,
        usuario: usuario
    })

    alertaLuminosidade.save()
        .then(() => console.log('Alerta de Luminosidade salvo com sucesso!, id: ' + alertaLuminosidade._id))
        .catch(err => console.log(err))
}

updateListIrrigacao = (usuario, plantacao) => {
    let i = undefined
    if (irrigacoes[0]) i = irrigacoes.findIndex(obj => obj.plantacao == plantacao)
    if (i == undefined) {
        let irrigacao = {
            _id: new mongoose.Types.ObjectId(),
            inicio: Date.now(),
            fim: undefined,
            plantacao: plantacao,
            usuario: usuario,
        }
        irrigacoes.push(irrigacao)
    }
}

saveIrrigacao = (plantacao) => {
    let i = undefined
    i = irrigacoes.findIndex(obj => obj.plantacao == plantacao)
    if (i != undefined) {
        let irrigacao = new Irrigacao({
            _id: irrigacoes[i]._id,
            inicio: irrigacoes[i].inicio,
            fim: Date.now(),
            plantacao: irrigacoes[i].plantacao,
            usuario: irrigacoes[i].usuario,
        })
        irrigacao.save()
            .then(() => console.log('Irrigação salva com sucesso!, id: ' + irrigacao._id))
            .catch(err => console.log(err))
        irrigacoes.splice(i, 1)
    }
}

regar = async (topic, message) => {
    let p = await plantacoes.find(obj => obj.usuario == topic)
    if (message.uS < p.plantacao.uS0) {
        client_mqtt.publish(topico_regador_c + topic, '1')
        updateListIrrigacao(topic, p.plantacao._id)
    }
    else {
        client_mqtt.publish(topico_regador_c + topic, '0')
        saveIrrigacao(p.plantacao._id)
    }
}

alertas = async (topic, message) => {
    let m = { t: '', u: '', uS: '', l: '', c: '' }
    let p = await plantacoes.find(obj => obj.usuario == topic)
    if (message.t < p.plantacao.t0) {
        m.t = (message.t - p.plantacao.t0).toFixed(1)
        saveAlertaTemperatura(m.t, topic, p.plantacao._id)
        m.t = m.t + ' ºC'
    } else if (message.t > p.plantacao.t1) {
        m.t = (message.t - p.plantacao.t1).toFixed(1)
        saveAlertaTemperatura(m.t, topic, p.plantacao._id)
        m.t = m.t + ' ºC'
    }

    if (message.u < p.plantacao.u0) {
        m.u = (message.u - p.plantacao.u0).toFixed(1)
        saveAlertaUmidade(m.u, topic, p.plantacao._id)
        m.u = m.u + ' %'
    } else if (message.u > p.plantacao.u1) {
        m.u = (message.u - p.plantacao.u1).toFixed(1)
        saveAlertaUmidade(m.u, topic, p.plantacao._id)
        m.u = m.u + ' %'
    }

    if (message.uS < p.plantacao.uS0) {
        m.uS = (message.uS - p.plantacao.uS0).toFixed(1)
        saveAlertaUmidadeSolo(m.uS, topic, p.plantacao._id)
        m.uS = m.uS + ' %'
    } else if (message.uS > p.plantacao.uS1) {
        m.uS = (message.uS - p.plantacao.uS1).toFixed(1)
        saveAlertaUmidadeSolo(m.uS, topic, p.plantacao._id)
        m.uS = m.uS + ' %'
    }

    if (message.l < p.plantacao.l0 &&
        new Date().getHours() >= 6 && new Date().getHours() <= 17) {
        m.l = (message.l - p.plantacao.l0).toFixed(1)
        saveAlertaLuminosidade(m.l, topic, p.plantacao._id)
        m.l = m.l + ' %'
    } else if (message.l > p.plantacao.l1 &&
        new Date().getHours() >= 6 && new Date().getHours() <= 17) {
        m.l = (message.l - p.plantacao.l1).toFixed(1)
        saveAlertaLuminosidade(m.l, topic, p.plantacao._id)
        m.l = m.l + ' %'
    }
    client_mqtt.publish(topico_alertas + topic, JSON.stringify(m))
}

client_mqtt.on('message', (topic, message) => {
    if (topic.split('.')[0] + '.' == topico_sensores_c) {
        regar(topic.split('.')[1], JSON.parse(message.toString()))
        alertas(topic.split('.')[1], JSON.parse(message.toString()))
    }
})