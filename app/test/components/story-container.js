var test = require('tape')
var { template, controller } = require('../../components/story-container')

var htmlOutput = `
    <div class='container'>
      <ul>
        <story ng-repeat="story in $ctrl.stories track by $index" index='$index' story='story'></story>
      </ul>
    </div>`

test('story-container template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})
