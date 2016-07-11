module.exports = {
  controller: ['$scope', 'HackerPouchService', controller],

  template: `
    <navbar></navbar>
    <story-container stories='$ctrl.stories'></story-container>`
}

function controller($scope, HackerPouchService) {
  const $ctrl = this
  $ctrl.stories = []

  HackerPouchService.getNews('top')
    .then(function(stories) {
      $scope.$apply(function(){
        $ctrl.stories = stories
      })
    })
    .then(function() {
      HackerPouchService.getAllNews()
    })
    .then(function() {
      // HackerPouchService.trackDBChanges()
    })
    .catch(function(err) {
      console.log("BREAKAGE",err)
    })

  HackerPouchService.update(function (stories) {
    $scope.$apply(function() {
      $ctrl.stories = stories
    })
  })

}
