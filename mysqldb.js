'user strict';

var mysql = require('mysql');


//local mysql db connection
var dbconnection = mysql.createPool({

    host     : 'localhost',
    user     : 'root',
    password : 'Anks2809',
    database : 'twitdb'
    });
    
    dbconnection.on('error', function(err) {
        console.log('DB connection failed');
        throw err;
    });
    
module.exports = dbconnection;
