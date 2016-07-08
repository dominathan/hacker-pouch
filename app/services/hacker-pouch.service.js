module.exports = function ($http) {
  const PouchDB = require('pouchdb')
  const db = new PouchDB('hacker-pouch')
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  let listeners = []

  db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change',function (change) {
    console.log('STUFF IS UPDATING', change)
    // listeners[0](_.clone(change.doc))
    // getDocs()
  }).on('complete', function(info) {
    console.log('INFO', info)
  }).on('error', function (err) {
    console.log('ERROR', err)
  });

  if (window) {
    window.db = db
  }

  return {
    getDocs: getDocs,
    getNews: getNews,
    getDocsByWord: getDocsByWord,
    update: function (fn) {
      listeners.push(fn)
    }
  }

  function getDocsByWord (word) {
    db.allDocs({include_docs: true})
      .then(function (data) {
        return data.rows.filter(function (doc) {
          return doc.doc.internalType === word
        })
      })
      .then(function(dat) {
        return dat.map(function (item) {
          return cleanDBStory(item,word)
        })
      })
      .then(function(cleanData) {
        listeners[0](_.clone(cleanData.slice(0,30)))
      })
      .catch(function(err) {
        console.log("SHIT", err)
      })
  }

  function getNews (word) {
    return new Promise(function (resolve, reject) {
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
      .then(function (cleanData) {
        bulkInsert(cleanData)
      })
      .catch(function (err) {
        console.log('ERROR GETTING NEWS', err)
        reject(err)
      })
    })
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

  function bulkInsert (items) {
    return db.bulkDocs(items)
  }

  function getDocs () {
    return new Promise(function (resolve, reject) {
      db.allDocs({include_docs: true})
        .then(function (results) {
          if (results.total_rows) {
            return results.rows.slice(0, 30)
                          .map(function(item,word) {
                            return cleanDBStory(item,word)
                          })
          } else {
            return new Promise(function (resolver, rejecter) {
              getNews('top')
              .then(function (data) {
                return resolver(data)
              })
              .catch(function (err) {
                rejecter(err)
              })
            })
          }
        })
        .then(function (cleanData) {
          resolve(cleanData)
        })
        .catch(function (err) {
          console.log('WELL SHIT', err)
          reject(err)
        })
    })
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
      internalType: word
    }
  }
}
