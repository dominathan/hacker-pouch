module.exports = function ($http) {
  var baseUrl = 'https://hacker-news.firebaseio.com/v0'

  return {
    getNews: getNews
  }

  function getNews () {
    return new Promise(function(resolve,reject) {
      $http.get(`${baseUrl}/newstories.json`)
      .then(function (newStoryIds) {
        return newStoryIds.data.slice(0, 29)
      })
      .then(function (top30StoryIds) {
        var promiseLibs = []
        top30StoryIds.forEach(function (storyId) {
          promiseLibs.push($http.get(`${baseUrl}/item/${storyId}.json`))
        })

        return Promise.all(promiseLibs)
      })
      .then(function (data) {
        resolve(data)
      })
      .catch(function (err) {
        console.log('well shit', err)
        reject(err)
      })
    })
  }
}
