var test = require('tape')
var sinon = require('sinon')
require('sinon-as-promised')

var { fakeData1, fakeData2 } = require('../test-utilities/test-data')
var get = sinon.stub().resolves({data:[123141,234432,454533,65457]})
var $mockHttp = {
  get: get
}

var {
      getAllNews,
      getNews,
      getDocsByWord
    } = require('../../services/hacker-pouch.service')($mockHttp)

test('HackerPouchService should return functions', function (t) {
  t.ok(getAllNews, 'should call getAllNews')
  t.ok(getNews, 'should call getNews')
  t.ok(getDocsByWord, 'should call getDocsByWord')

  t.end()
})

test('HackerPouchService.getNews', function (t) {
  // var thing = getNews('top')
  // console.log("WHYNOT", thing)
  // thing.then(function(data) {
  //   console.log("ANSWER", data)
  // })
  t.end()
})
