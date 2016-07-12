var test = require('tape')
var { template, controller } = require('../../components/pagination')
var MockHackerPouch = require('../test-utilities/mock.service')

var htmlOutput = `
    <ul class='pagination'>
      <li ng-click='$ctrl.nextPage()'> <-- More --> </li>
    </ul>`

test('pagination template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})

test('pagination controller', function (t) {
  let c = controller[controller.length - 1]
  let ctrl = {}

  c.apply(ctrl, [MockHackerPouch])
  t.ok(ctrl.nextPage, '$ctrl.nextPage should be available')

  t.end()
})
