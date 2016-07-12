var { filterByInternalType,
      cleanBulkData
    } = require('../lib/utils')()

module.exports = function ($http) {
  const PouchDB = require('pouchdb')
  const db = new PouchDB('hacker-pouch')
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  let listeners = []

  return {
    getAllNews: getAllNews,
    getNews: getNews,
    trackDBChanges: listenForDbChanges,
    getDocsByWord: getDocsByWord,
    update: function (fn) {
      listeners.push(fn)
    }
  }

  function getDocsByWord (word) {
    word = word || 'top'
    getNews(word)
    db.allDocs({include_docs: true})
      .then((data) => filterByInternalType(data, word))
      .then((filteredData) => cleanBulkData(filteredData, word))
      .then((cleanData) => listeners[0](_.clone(cleanData.slice(0, 30))))
      .catch(handleErrors)
  }

  function getAllNews () {
    ['top', 'best', 'new', 'job', 'ask', 'show'].forEach(getNews)
  }

  function getNews (word) {
    return new Promise((resolve, reject) => {
      $http.get(`${baseUrl}/${word}stories.json`)
        .then((newStoryIds) => newStoryIds.data.slice(0, 30))
        .then(bulkGetInfoFromHackerIds)
        .then((promiseData) => cleanBulkData(promiseData, word))
        .then((cleanData) => {
          resolve(cleanData)
          bulkInsert(cleanData)
        })
        .catch(handleErrors)
    })
  }

  function getInfoFromHackerId (storyId) {
    return $http.get(`${baseUrl}/item/${storyId}.json`)
  }

  function bulkGetInfoFromHackerIds (storyIds) {
    return Promise.all(storyIds.map(getInfoFromHackerId))
  }

  function handleErrors (err) {
    console.log('ERROR', err)
  }

  function bulkInsert (items) {
    items.forEach((itemToSave) => updateDoc(itemToSave))
  }

  function listenForDbChanges () {
    db.changes({
      since: 'now',
      include_docs: true
    })
    .on('complete', (info) => {
      if (info.results.length) {
        console.log('info for complete event', info)
        getDocsByWord(info.results[0].doc.internalType)
      }
    })
    .on('error', handleErrors)
  }

  function updateDoc (hackItem) {
    db.get(hackItem._id)
      .then((doc) => {
        if (doc.descendants !== hackItem.descendants || doc.score !== hackItem.score) {
          return db.put(Object.assign(doc, hackItem))
                   .catch((err) => console.log('Error updating item', err))
        }
      })
      .catch((err) => {
        if (err.name === 'not_found') {
          db.put(hackItem)
            .catch((error) => console.log('TROUBLE SAVING NEW ITEM', error))
        }
      })
  }
}
