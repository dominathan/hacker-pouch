const test = require('tape')

var {
      getAllNews,
      getNews,
      getDocsByWord
    } = require('../../services/hacker-pouch.service')()

test('HackerPouchService should return functions', function (t) {
  t.ok(getAllNews, 'should call getAllNews')
  t.ok(getNews, 'should call getNews')
  t.ok(getDocsByWord, 'should call getDocsByWord')

  t.end()
})
