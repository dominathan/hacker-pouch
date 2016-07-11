var { cleanStory,
      filterByInternalType,
      cleanBulkData
    } = require('../lib/utils')()

module.exports = function ($http) {
  const PouchDB = require('pouchdb')
  const db = new PouchDB('hacker-pouch')
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  let listeners = []

  if (window) {
    window.db = db
  }

  return {
    getAllNews: getAllNews,
    getNews: getNews,
    trackDBChanges: dbChanges,
    getDocsByWord: getDocsByWord,
    update: function (fn) {
      listeners.push(fn)
    }
  }

  function dbChanges() {
    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
    .on('change',(change) => getDocsByWord(change.doc.internalType))
  }

  function getDocsByWord (word) {
    word = word || 'top'
    getNews(word)
    db.allDocs({include_docs: true})
      .then((data) => filterByInternalType(data,word))
      .then((filteredData) => cleanBulkData(filteredData,word))
      .then((cleanData) => listeners[0](_.clone(cleanData.slice(0,30))))
      .catch(handleErrors)
  }

  function getAllNews() {
    ['top','best','new','job','ask','show'].forEach(getNews)
  }

  function getNews (word) {
    return new Promise((resolve,reject) => {
      $http.get(`${baseUrl}/${word}stories.json`)
        .then((newStoryIds) => newStoryIds.data.slice(0, 30))
        .then((top30StoryIds) => {
          return Promise.all(top30StoryIds.map((storyId) => $http.get(`${baseUrl}/item/${storyId}.json`)))
        })
        .then((promiseData) => cleanBulkData(promiseData,word))
        .then((cleanData) => {
          resolve(cleanData)
          bulkInsert(cleanData)
        })
        .catch(handleErrors)
    })
  }

  function handleErrors(err) {
    console.log("ERROR", err)
  }

  function bulkInsert (items) {
    return db.bulkDocs(items)
  }

}
