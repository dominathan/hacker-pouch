var { filterByInternalType, cleanBulkData } = require('../lib/utils')()

module.exports = function ($http, PouchDBService) {
  const baseUrl = 'https://hacker-news.firebaseio.com/v0'
  const { db, bulkInsert, updateDoc } = PouchDBService.init('hacker-pouch')
  let listeners = []
  let offset = 31
  let currentFilteredWord = 'top'

  return {
    getAllNews: getAllNews,
    getNews: getNews,
    getDocsByWord: getDocsByWord,
    fetchNextPage: fetchNextPage,
    update: function (fn) {
      listeners.push(fn)
    }
  }

  function getDocsByWord (word) {
    word = word || 'top'
    offset = 31
    currentFilteredWord = word
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

  function fetchNextPage () {
    db.allDocs({include_docs: true})
      .then((data) => filterByInternalType(data, currentFilteredWord))
      .then((paginatedData) => cleanBulkData(paginatedData, currentFilteredWord))
      .then((cleanData) => listeners[0](_.clone(cleanData.slice(offset, offset + 30))))
      .then(() => offset += 30)
      .catch(handleErrors)
  }
}
