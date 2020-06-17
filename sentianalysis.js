const senti = require('sentiment')
var Senti = new senti()
var result = Senti.analyze('cats are hilarious') 
console.log(result)   