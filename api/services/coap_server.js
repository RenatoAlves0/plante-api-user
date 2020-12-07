
const coap = require('coap')
const server = coap.createServer()

server.on('request', function (req, res) {
    console.log(req.url.split('/?')[1]);
    var interval = setInterval(function () {
        res.write(new Date().toISOString() + '\n')
    }, 1000)

    res.on('finish', function (err) {
        clearInterval(interval)
    })
})

server.listen(function () {
    console.log('server started')
})