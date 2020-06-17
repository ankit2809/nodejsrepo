const express = require('express')
var Twit = require('twit')
var config = require('./config.js')
var mysqlconn = require('./mysqldb.js')
require('log-timestamp');

const app = express()
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }))

port = process.env.PORT || 8080
app.use(express.static(__dirname))

app.get('/',(req,res)=> {
    res.sendFile("index.html")
})

app.get('/optionlist',(req,res)=> {
    mysqlconn.query("select city from citymaster", (err, rows, fields) => {
        if (err) throw err;
          res.send(rows)
          console.log("Cities : " + rows.length)
        });
})

var message = []
var twit_message = []
var twit_trends = []

app.get('/listtweets',(req,res)=> {
    //res.send(message)
    res.send(twit_message)
})


app.get('/checktrends',(req,res)=> {
    
    // Get the result into database
    sql = "select C.city, T.created_at, T.hashtag, T.tweetcount from citymaster C, trending T where C.woeid = T.woeid"

    mysqlconn.query(sql, (err, rows, fields) => {
        if (err) throw err;
          res.send(rows)
          console.log(rows.length + " rows fetched")
        });
})

process.on('uncaughtException', function (error) {
    console.log(error.stack);
 });

app.post('/checktrends',(req,res)=> {
   
    var trend_location = req.body.city_selected
    mysqlconn.query("select woeid from citymaster where city=?", trend_location,function (err, rows, fields) {
        if (err) throw err;
        //console.log(rows[0].woeid)
        trend_woeid=rows[0].woeid
      
    var T1 = new Twit(config)
    //T1.get('trends/place',{"id":698064}, gotDataTrends)
    T1.get('trends/place',{"id":trend_woeid}, gotDataTrends)

    function gotDataTrends(err, data1) {
        if (err) throw err;
        console.log(data1[0].locations[0].name)
        console.log(data1[0].created_at)
        
        // Store the result into database
        sql = "INSERT INTO trending (woeid, created_at, hashtag, tweetcount) VALUES ?"
    
        for (var i = 0; i < 10; i++) {
            twit_trends.push({place:data1[0].trends[i].name,tweets:data1[0].trends[i].tweet_volume})
            values = [[trend_woeid, data1[0].created_at, data1[0].trends[i].name,data1[0].trends[i].tweet_volume]]
            mysqlconn.query(sql, [values] , function (err, result) {
                if (err) throw err;
            });
        }
        //console.log("DB entries updated")
      }
    
  
})

})

app.post('/findtweets', (req, res) => {
    var qword = req.body.search_keyword
    //console.log(qword)

    var T = new Twit(config)
    var twit_params = {q:qword, count : 2}   // Convert q into a variable and get the value from findkeyword
    T.get('search/tweets', twit_params, gotData)

    function gotData(err, data) {
     var tweets = data.statuses;
     for (var i = 0; i < tweets.length; i++) {
         //console.log(qword + " : " + tweets[i].created_at + " : " + tweets[i].text);
         //message.push(tweets[i].text);
         twit_message.push({keyword:qword,created:tweets[i].created_at,text:tweets[i].text})
    }
   }
    
   
})

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);