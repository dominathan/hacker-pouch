module.exports = {
  bindings: {
    stories: '<'
  },

  template: `
    <div class='container'>
      <ul>
        <story ng-repeat="story in $ctrl.stories track by story._id" index='$index' story='story'></story>
      </ul>
      <pagination></pagination>
    </div>`
}
