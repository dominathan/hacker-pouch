var test = require('tape')
var { template } = require('../../components/story')

var htmlOutput = `
    <li class="story">
      <div class="story-title">
        <a href="{{$ctrl.story.url}}">
          <span class="story-index">{{$ctrl.index + 1}}.  </span>{{$ctrl.story.title}}
        </a>
      </div>
      <div class="story-info">
        <span>{{$ctrl.story.score}} by {{$ctrl.story.by}} {{$ctrl.story.time}} | {{$ctrl.story.descendants}} Comments </span>
      </div>
    </li>`

test('story template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})
