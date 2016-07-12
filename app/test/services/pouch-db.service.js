var test = require('tape')
var sinon = require('sinon')
require('sinon-as-promised')

var { fakeData1, fakeData2 } = require('../test-utilities/test-data')
var PouchDBService = require('../../services/pouch-db.service')()

test('PouchDB service should return functions and create DB', function (t) {
  t.ok(PouchDBService.init, 'should be able to initialize databse')

  var { bulkInsert, updateDoc, db } = PouchDBService.init('test-db')

  t.ok(bulkInsert, 'should be able to call bulkInsert after DB creation')
  t.ok(updateDoc, 'should be able to call updateDoc after DB creation')
  t.ok(db, 'database should exist after DB creation')

  db.destroy()
    .then(function(data) {
      t.ok(data, 'should be able to destroy database')
      t.end()
    })

})
