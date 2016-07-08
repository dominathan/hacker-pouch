module.exports = {
  bindings: {

  },

  controller: function ($scope, HackerPouchService) {
    const $ctrl = this
    $ctrl.stories = []

    HackerPouchService.getDocs()
      .then(function (data) {
        $scope.$apply(function () {
          $ctrl.stories = data
        })
      })
      .catch(function (err) {
        $ctrl.stories = err
      })

    HackerPouchService.update(function (stories) {
      $ctrl.stories = stories
    })
  },

  template: `
    <navbar></navbar>
    <story-container stories='$ctrl.stories'></story-container>
  `
}
