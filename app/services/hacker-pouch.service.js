
var PouchDB = require('pouchdb')
var db = new PouchDB('hacker-pouch')

if(window) {
  window.PouchDB = db
}

module.exports = function ($http) {
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  let listeners = []

  return {
    getDocs: getDocs,
    getNews: getNews,
    update: function(fn) {
      listeners.push(fn)
    }
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
        return data.map(cleanStory)
      })
      .then(function (cleanData) {
        bulkInsert(cleanData)
        resolve(cleanData)
        listeners[0](_.clone(cleanData))
      })
      .catch(function (err) {
        console.log("ERROR GETTING NEWS", err)
        reject(err)
      })
    })

  }

  function cleanStory (story) {
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
      type: story.data.type
    }
  }

  function insertDB (item) {
    db.put(item)
      .then(function (resp) {
        console.log("CREATED Successfully", resp)
      })
      .catch(function (err) {
        console.log("DID NOT CREATE", err)
      })
  }

  function bulkInsert (items) {
    return db.bulkDocs(items)
  }

  function getDocs () {
    return new Promise(function (resolve, reject) {
      db.allDocs({include_docs: true})
        .then(function (results) {
          if(results.total_rows) {
            return results.rows.slice(0,30).map(cleanDBStory)
          } else {
            return new Promise(function (resolver,rejecter) {
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
        .then(function(cleanData) {
          resolve(cleanData)
          listeners[0](_.clone(cleanData))
        })
        .catch(function(err) {
          console.log("WELL SHIT", err)
          reject(err)
        })
    })
  }

  function cleanDBStory(story) {
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
      type: story.doc.type
    }
  }


}
