module.exports = {
  bindings: {

  },

  controller: function ($scope, HackerPouchService) {
    const $ctrl = this
    $ctrl.stories = []

    HackerPouchService.init()
      .then(function(stories) {
        $scope.$apply(function(){
          $ctrl.stories = stories
        })
      })
      .then(function() {
        HackerPouchService.getAllNews()
      })

    HackerPouchService.update(function (stories) {
      $scope.$apply(function() {
        $ctrl.stories = stories
      })
    })

  },

  template: `
    <navbar></navbar>
    <story-container stories='$ctrl.stories'></story-container>
  `
}
