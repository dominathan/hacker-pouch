module.exports = function ($http) {
  const PouchDB = require('pouchdb')
  const db = new PouchDB('hacker-pouch')
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  let listeners = []

  if (window) {
    window.db = db
  }

  return {
    init: init,
    getAllNews: getAllNews,
    getNews: getNews,
    getDocsByWord: getDocsByWord,
    update: function (fn) {
      listeners.push(fn)
    }
  }

  function init() {
    return getNews('top')
  }

  function dbChanges() {
    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
    .on('change',function (change) {
      getDocsByWord(change.doc.internalType)
    })
  }

  function getDocsByWord (word) {
    word = word || 'top'
    db.allDocs({include_docs: true})
      .then(function (data) {
        return data.rows.filter(function (doc) {
          return doc.doc.internalType === word
        })
      })
      .then(function(dat) {
        return dat.map(function (item) {
          return cleanDBStory(item)
        })
      })
      .then(function(cleanData) {
        listeners[0](_.clone(cleanData.slice(0,30)))
      })
      .catch(function(err) {
        console.log("SHIT", err)
      })
  }

  function getAllNews() {
    ['top','best','new','job','ask','show'].forEach(function(hackerNewsItem) {
      getNews(hackerNewsItem)
    })
  }

  function getNews (word) {
    return new Promise(function(resolve,reject) {
      $http.get(`${baseUrl}/${word}stories.json`)
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
          return data.map(function(item) {
            return cleanStory(item,word)
          })
        })
        .then(function(cleanData) {
          resolve(cleanData)
          return cleanData
        })
        .then(function (cleanData) {
          bulkInsert(cleanData)
        })
        .catch(function (err) {
          console.log('ERROR GETTING NEWS', err)
        })
    })
  }

  function bulkInsert (items) {
    return db.bulkDocs(items)
  }

  function cleanStory (story,word) {
    return {
      _id: story.data.id.toString(),
      title: story.data.title,
      by: story.data.by,
      time: story.data.time,
      descendants: story.data.descendants,
      url: story.data.url,
      kids: story.data.kids,
      score: story.data.score,
      text: story.data.text,
      type: story.data.type,
      internalType: word
    }
  }

  function cleanDBStory (story,word) {
    return {
      _id: story.doc._id.toString(),
      _rev: story.doc._rev,
      title: story.doc.title,
      by: story.doc.by,
      time: story.doc.time,
      descendants: story.doc.descendants,
      url: story.doc.url,
      kids: story.doc.kids,
      score: story.doc.score,
      text: story.doc.text,
      type: story.doc.type,
      internalType: story.doc.internalType
    }
  }
}
