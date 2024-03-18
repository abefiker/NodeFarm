const fs = require('fs');
const http = require('http')

const server = http.createServer()
server.on('request', (req, res) => {
    //solution 1
    // fs.readFile('test-file.txt', 'utf-8', (err, data) => {
    //     if (err) throw err
    //     res.end(data)
    // })
    //sreams solution
    const readable = fs.createReadStream('test-file.txt')
    readable.on('data', chunk => {
        res.write(chunk);
    })
    readable.on('error', err => {
        console.log(err)
        res.statusCode = 500
        res.end('File is not found')
    })
    readable.on('end', () => {
        res.end()
    })
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000')
})