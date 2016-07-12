module.exports = {
  bindings: {
    stories: '<'
  },

  template: `
    <div class='container'>
      <ul>
        <story ng-repeat="story in $ctrl.stories track by $index" index='$index' story='story'></story>
      </ul>
      <pagination></pagination>
    </div>`
}
