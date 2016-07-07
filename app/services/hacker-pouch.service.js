
var PouchDB = require('pouchdb')
var db = new PouchDB('hacker-pouch')

if(window) {
  window.PouchDB = db
}

module.exports = function ($http) {
  var baseUrl = 'https://hacker-news.firebaseio.com/v0'

  return {
    getNews: getNews
  }

  function getNews () {
    return new Promise(function(resolve,reject) {
      $http.get(`${baseUrl}/topstories.json`)
      .then(function (newStoryIds) {
        return newStoryIds.data.slice(0, 30)
      })
      .then(function (top30StoryIds) {
        var promiseLibs = []
        top30StoryIds.forEach(function (storyId) {
          promiseLibs.push($http.get(`${baseUrl}/item/${storyId}.json`))
        })

        return Promise.all(promiseLibs)
      })
      .then(function (data) {
        return data.map(cleanStory)
      })
      .then(function(cleanData) {
        cleanData.map(insertDB)
        resolve(cleanData)
      })
      .catch(function (err) {
        console.log('well shit', err)
        reject(err)
      })
    })
  }


  function cleanStory(story) {
    return {
      _id: story.data.id.toString(),
      title: story.data.title,
      by: story.data.by,
      time: story.data.time,
      descendants: story.data.descendants,
      url: story.data.url,
      kids: story.data.kids,
      score: story.data.score
    }
  }

  function insertDB(item) {
    db.put(item)
      .then(function(resp) {
        console.log("CREATED Successfully", resp)
      })
      .catch(function(err) {
        console.log("DID NOT CREATE", err)
      })
  }


}
