/*
// arguments is an array in JS. and this array contains all the values that were passed into a function. If we see something when we console log it, then it means that we are really in a function.
console.log(arguments);
// wrapper function
console.log(require("module").wrapper);
*/

// Using module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));

// Using exports
// the calc2 here is the exports object now.
//const calc2 = require("./test-module-2");
//console.log(calc2.multiply(2, 5));
// we can use ES6 destructuring too.
const { add, multiply, divide } = require("./test-module-2");
console.log(multiply(2, 5));

// Caching
// we have 'hello from the module' only once, because of caching.
// So technically this module was only loaded once. and so the code inside of it was also executed once only.
// the other two loggings came from cache. they were stored somewhere in the node process's cache.
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
