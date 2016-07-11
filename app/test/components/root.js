var test = require('tape')
var HackerPouchServiceMock = require('../test-utilities/mock.service')
var { template, controller } = require('../../components/root')

var htmlOutput = `
    <navbar></navbar>
    <story-container stories='$ctrl.stories'></story-container>`

var ScopeMock = {
  $apply: function() {
    return
  }
}

test('root template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})

test('root controller', function (t) {
  let c = controller[controller.length - 1]
  let ctrl = {}

  c.apply(ctrl, [ScopeMock, HackerPouchServiceMock])
  t.ok(ctrl.stories, '$ctrl.stories should be set')

  // t.deepEquals(ctrl.stories, [{title: 'Test works', author: 'Nathan'}], '$ctrl.stories should equal return value')

  t.end()
})
