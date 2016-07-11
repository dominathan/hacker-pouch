var test = require('tape')
var { cleanStory,
      cleanBulkData,
      filterByInternalType } = require('../../lib/utils')()

var fakeData1 = {
  doc: {
    id: 1,
    title: "OH WELL",
    by: "Nathan",
    time: new Date(),
    descendants: 1,
    url: 'http://www.google.com',
    kids: [1,2,3],
    score: 39,
    text: "ALL DATA",
    type: "story",
  }
}

var fakeData2 = {
  doc: {
    _id: 2,
    title: "Crap",
    by: "Newfoundland",
    time: new Date(),
    descendants: 4,
    url: 'http://www.facebook.com',
    kids: [4,5,6,7],
    score: 10,
    text: "Hummmmmm",
    type: "job",
  }
}


test('The util function cleanStory', function (t) {
  t.ok(cleanStory, 'should be able to execute')

  var cleansedStory = cleanStory(fakeData1, 'top')
  t.equals(cleansedStory._id, '1', 'should have a stringified _id')
  t.equals(cleansedStory.title, 'OH WELL', 'should have a title')
  t.equals(cleansedStory.internalType, 'top', 'should have internalType supplied')

  var cleansedStory2 = cleanStory(fakeData2, 'job')
  t.equals(cleansedStory2._id, '2', 'should have a stringified _id')
  t.equals(cleansedStory2.title, 'Crap', 'should have a title')
  t.equals(cleansedStory2.internalType, 'job', 'should have internalType supplied')
  t.end()

})

test('util function cleanBulkData', function (t) {
  t.ok(cleanBulkData, 'should be able to execute')

  var cleansedBulk = cleanBulkData([fakeData1, fakeData2], 'show')

  t.equals(cleansedBulk[1]._id, '2', 'should have a stringified _id')
  t.equals(cleansedBulk[1].title, 'Crap', 'should have a title')
  t.equals(cleansedBulk[1].internalType, 'show', 'should have internalType supplied')
  t.end()
})


test('util function filterByInternalType', function (t) {
  t.ok(filterByInternalType, 'should be able to execute')

  var cleansedData =  cleanBulkData([fakeData1, fakeData2], 'show')
  var stuffToFilter = {
    rows: cleansedData.map(function(item) {
      return {
        doc: item
      }
    })
  }
  var filteredBulk = filterByInternalType(stuffToFilter, 'show')
  
  t.equals(filteredBulk.length, 2, 'should have two items')
  t.equals(filteredBulk[1].doc._id, '2', 'should have a stringified _id')
  t.equals(filteredBulk[1].doc.title, 'Crap', 'should have correct title')
  t.equals(filteredBulk[1].doc.internalType, 'show', 'should have correct internalType')

  t.end()
})
