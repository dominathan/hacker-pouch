module.exports = {
  bindings: {

  },

  controller: function ($scope,HackerPouchService) {
    const $ctrl = this
    $ctrl.stories = [];

    HackerPouchService.getNews()
      .then(function (data) {
        $scope.$apply(function() {
          $ctrl.stories = data
        })
      })
      .catch(function (err) {
        $ctrl.stories = err
      })
  },

  template: `
    <navbar></navbar>
    <story-container stories='$ctrl.stories'></story-container>
  `
}
