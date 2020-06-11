const express = require('express')
var Twit = require('Twit')
var config = require('./config.js')
const app = express()
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }))

port = process.env.PORT || 3010
app.use(express.static(__dirname))

app.get('/',(req,res)=> {
    res.sendFile("index.html")
})

var message = []
app.get('/listtweets',(req,res)=> {
    res.send(message)
})

app.post('/findtweets', (req, res) => {
    var qword = req.body.search_keyword
    console.log(qword)

    var T = new Twit(config)
    var twit_params = {q:qword, count : 1}   // Convert q into a variable and get the value from findkeyword
    T.get('search/tweets', twit_params, gotData)

    function gotData(err, data) {
     var tweets = data.statuses;
     for (var i = 0; i < tweets.length; i++) {
         console.log(tweets[i].text);
         message.push(tweets[i].text);
    }
   }
})

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);