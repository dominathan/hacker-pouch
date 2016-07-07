var express = require('express')
var port = process.env.PORT || 3001
var http = require('http')
var request = require('request')
var bodyParser = require('body-parser')

var app = express()

app.set('port', process.env.PORT || 3000)


app.use(express.static(__dirname + "/app"))
app.use(bodyParser.json())

app.get('/', function(req,res) {
  res.sendFile('app')
})

app.get('/category', function(req,res,next) {
  var randomCategory = Math.ceil(Math.random()*18418)
  var url = 'http://jservice.io/api/category?id=' + randomCategory
  request.get({url: url}, function(err, response) {
    if(err) return next(err)
    res.send(JSON.parse(response.body))
  })
})

app.listen(port, function() {
  console.log(' LISTENING ON PORT ' + port)
})
