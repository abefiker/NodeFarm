const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;
setTimeout(() => console.log('Timer one finished'), 0);
setImmediate(() => console.log('immediate 1 finished'));
fs.readFile('test-file.txt', 'utf-8', () => {
    console.log('I/O completed ');

    setTimeout(() => console.log('Timer 2 finished'), 0);
    setTimeout(() => console.log('Timer 3 finished'), 4200);
    setImmediate(() => console.log('immediate two finished'));

    process.nextTick(() => console.log('Process.NextTick finished'))

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
    console.log(Date.now() - start, 'password encrypted');

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
    console.log(Date.now() - start, 'password encrypted');

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
    console.log(Date.now() - start, 'password encrypted');
    
    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
    console.log(Date.now() - start, 'password encrypted');

});
console.log('hello from top level code')    
