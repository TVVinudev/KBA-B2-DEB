
const lodash = require('lodash')
const math = require('./math');


console.log('Hello Word');

const name = 'Node.js';

console.log(`hello, ${name} !`)

if(name === 'Node.js'){
    console.log('running on Node.js enviornment')
}

for(let i = 0; i<5;i++){
    console.log(i)
}

let array = [1,2,3,4,5]
console.log(lodash.reverse(array));

console.log(math.sum(5,6));