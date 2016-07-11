var express = require('express')
var port = process.env.PORT || 3001
var bodyParser = require('body-parser')

var app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile('app')
})

app.listen(port, function () {
  console.log(' LISTENING ON PORT ' + port)
})
