var express = require('express')
var PouchDB = require('pouchdb')
var port = process.env.PORT || 3001
var bodyParser = require('body-parser')

var app = express()

app.set('port', process.env.PORT || 3000)

// Initializers to use for express
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())
app.use('/db', require('express-pouchdb')(PouchDB))

var HackerPouchDB = new PouchDB('hacker-pouch')

// Routes
app.get('/', function (req, res) {
  res.sendFile('app')
})

app.listen(port, function () {
  console.log(' LISTENING ON PORT ' + port)
})
