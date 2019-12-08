const axios = require('axios')

sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

init = async () => {
    await axios.get('https://plante-api-user.herokuapp.com/keepAlive')
        .then(data => console.log(data.data))
    await sleep(600000) //600000 ms -> 10 minutos
    init()
}

init()