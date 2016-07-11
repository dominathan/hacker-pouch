module.exports = {
  getNews: function () {
    return new Promise((resolve, reject) => {
      resolve([
        {
          title: 'Test works',
          author: 'Nathan'
        }
      ])
    })
  },
  getAllNews: function () {
    return
  },
  update: function () {
    return
  },
  getDocsByWord: function (word) {
    return [
      {thing1: 'thing1', thing2: 'thing2'},
      {thing3: 'thing3', thing4: 'thing4'}
    ]
  }
}
