module.exports = {
  bindings: {
    story: '<',
    index: '<'
  },

  controller: ['HackerPouchService', controller],

  template: `
    <li class="story">
      <div class="story-title">
        <span class="story-index">{{$ctrl.index + 1}}. </span>
        <div ng-show='$ctrl.showUpvote' class="triangle" ng-click='$ctrl.submitUpvote($ctrl.story._id)'></div>
        <a href="{{$ctrl.story.url}}">
          {{$ctrl.story.title}}
        </a>
      </div>
      <div class="story-info">
        <span>{{$ctrl.story.score + $ctrl.story.upvotes}} by {{$ctrl.story.by}} {{$ctrl.story.time}} | {{$ctrl.story.descendants}} Comments </span>
      </div>
    </li>`
}

function controller (HackerPouchService) {
  const $ctrl = this

  $ctrl.showUpvote = true
  $ctrl.submitUpvote = (storyId) => {
    HackerPouchService.saveUpvote(storyId)
    $ctrl.showUpvote = false
  }
}
