const axios = require('axios')

sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

init = async () => {
    await axios.get('https://plante-api-user.herokuapp.com/keepAlive')
    await sleep(3 * 600000) //30 minutos
    init()
}

init()