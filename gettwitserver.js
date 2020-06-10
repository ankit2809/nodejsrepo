var express = require('express')
var Twit = require('Twit')
var config = require('./config.js')
var app = express()
port = process.env.PORT || 3010
app.use(express.static(__dirname))


var T = new Twit(config)
var twit_params = {q:"ndtv", count : 10}
T.get('search/tweets', twit_params, gotData)

  function gotData(err, data) {
    var tweets = data.statuses;
    for (var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].text);
    }
  }
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);