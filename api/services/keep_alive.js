import { get } from 'axios'

sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

init = async () => {
    await get('https://plante-api-user.herokuapp.com/keepAlive')
    await sleep(600000) //10 minutos
    init()
}

init()