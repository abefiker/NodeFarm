const fs = require('fs')
const http = require('http')
const url = require('url')
//blocking-synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(textIn)

// const textOut = `This what we know about avocado : ${textIn}\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('File Written!')

//non-blocking -> asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) {
//         return console.log(err);
//     }
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         if (err) {
//             return console.log(err);
//         }
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             if (err) {
//                 return console.log(err);
//             }
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 if (err) {
//                     return console.log(err);
//                 }
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });

// console.log('Reading File ...');

//////////////////////////
///////////SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj = JSON.parse(data)
const server = http.createServer((req,res)=>{
    const pathName = req.url
    if(pathName === '/' || pathName === '/overview'){
        res.end('Hello from the OVERVIEW')
    }else if(pathName === '/product'){
        res.end('Hello from PRODUCT')
    }else if(pathName === '/api'){
        res.writeHead(200,{'Content-Type':'application/json'})
        res.end(data)

    }else{
        res.writeHead(404,{
            'Content-Type':'text/html',
            'myown-header':'hello world'
        })
        res.end('<h1>Page not Found!</h1>')
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to request on port 8000')
})