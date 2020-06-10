'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Anks2809',
    database : 'transwords'
});

connection.connect(function(err) {
    if (err) 
        throw err;
    else
        console.log("Connected!");
});

module.exports = connection;