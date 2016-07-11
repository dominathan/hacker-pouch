var moment = require('moment')

module.exports = function () {
  return {
    cleanStory: cleanStory,
    cleanBulkData: cleanBulkData,
    filterByInternalType: filterByInternalType
  }

  function cleanStory (story, word) {
    story = story.data || story.doc
    let id = story.id || story._id
    let time = moment(new Date(story.time * 1000))
    let hackerNewsTime = time.fromNow()
    return {
      _id: id.toString(),
      title: story.title,
      by: story.by,
      time: hackerNewsTime,
      descendants: story.descendants,
      url: story.url,
      kids: story.kids,
      score: story.score,
      text: story.text,
      type: story.type,
      internalType: word || story.internalType
    }
  }

  function filterByInternalType (data, type) {
    return data.rows.filter((doc) => doc.doc.internalType === type)
  }

  function cleanBulkData (bulkData, word) {
    return bulkData.map((item) => cleanStory(item, word))
  }
}
