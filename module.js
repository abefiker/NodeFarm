// console.log(arguments)
// console.log(require('module').wrapper)
const C = require('./tes.module-1')
const calc1 = new C()
console.log(calc1.add(2, 4))
console.log(calc1.multiply(2, 4))
console.log(calc1.divide(4, 2))
// const {add,multiply,divide} = require('./tes.module-2')
// console.log(add(3,5))
// console.log(multiply(3,5))
// console.log(divide(9,3))

//caching

require('./test-module-3')()
require('./test-module-3')()
require('./test-module-3')()


