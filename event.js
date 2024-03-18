const EventEmitter = require('events')
const http = require('http')
class Sales extends EventEmitter {
    constructor() {
        super();

    }
}
const myEventEmmitter = new Sales()
myEventEmmitter.on('newSale', () => {
    console.log('there was new sale')
})
myEventEmmitter.on('newSale', () => {
    console.log('costomer new : Abemelek')
})
myEventEmmitter.on('newSale', stock => {
    console.log(`there are ${stock} items left in the stock`);
})
myEventEmmitter.emit('newSale', 9)
////////////////////////////////////////////////////////////////

const server = http.createServer()
server.on('request', (req, res) => {
    console.log('request received')
    res.end('Request received')
})
server.on('request', (req, res) => {
    console.log('Another Request 😘')
})
server.on('close',()=>{
    console.log('server closed')
})
server.listen(8000,'127.0.0.1',()=>{
    console.log('request waiting...')
})