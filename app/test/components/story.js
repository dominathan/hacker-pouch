var test = require('tape')
var { template, controller } = require('../../components/story')
var HackerPouchServiceMock = require('../test-utilities/mock.service')

var htmlOutput = `
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

test('story template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})

test('story controller', function (t) {
  let c = controller[controller.length - 1]
  let ctrl = {}

  c.apply(ctrl, [HackerPouchServiceMock])
  t.ok(ctrl.submitUpvote, '$ctrl.stories should be set')
  t.equals(ctrl.showUpvote, true, '$ctrl.showUpvote should be false')

  ctrl.submitUpvote()
  t.equals(ctrl.showUpvote, false, '$ctrl.showUpvote should be true after toggle')

  t.end()
})
