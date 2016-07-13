var test = require('tape')
var sinon = require('sinon')
require('sinon-as-promised')

var $mockHttp = {
  get: sinon.stub().resolves({data: [123141, 234432, 454533, 65457]})
}

var MockPouchDBService = {
  init (dbName) {
    return {
      bulkInsert () {},
      updateDoc () {},
      db: {}
    }
  }
}

var {
      getAllNews,
      getNews,
      getDocsByWord
    } = require('../../services/hacker-pouch.service')($mockHttp, MockPouchDBService)

test('HackerPouchService should return functions', function (t) {
  t.ok(getAllNews, 'should call getAllNews')
  t.ok(getNews, 'should call getNews')
  t.ok(getDocsByWord, 'should call getDocsByWord')

  t.end()
})
