module.exports = {
  bindings: {
    stories: '<',
  },

  controller: function() {
    const $ctrl = this

  },

  template: `
    <div class='container'>
      <ul>
        <story ng-repeat="story in $ctrl.stories track by $index" index='$index' story='story'></story>
      </ul>
    </div>
  `
}
