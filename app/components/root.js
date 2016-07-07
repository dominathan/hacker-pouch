module.exports = {
  bindings: {

  },

  controller: function(HackerPouchService) {
    HackerPouchService.getNews()
      // .then(function(data) {
      //   console.log(data)
      // })
  },

  template: `
    <h3>TEMPLATE ROOT</h3>
  `
}
