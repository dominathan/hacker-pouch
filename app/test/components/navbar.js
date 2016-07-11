var test = require('tape')
var HackerPouchServiceMock = require('../test-utilities/mock.service')
var { template, controller } = require('../../components/navbar')

var htmlOutput = `
    <header>
      <nav>
        <h2 ng-click="$ctrl.getDocs('best')">Hacker Pouch</h2>
        <ul>
          <li ng-click="$ctrl.getDocs('new')"> new </li> |
          <li ng-click="$ctrl.getDocs('top')"> top </li> |
          <li ng-click="$ctrl.getDocs('best')"> best </li> |
          <li ng-click="$ctrl.getDocs('show')"> show </li> |
          <li ng-click="$ctrl.getDocs('ask')"> ask </li> |
          <li ng-click="$ctrl.getDocs('job')"> jobs </li> |
          <li> submit </li>
      </nav>
    </header>`

test('navbar template', function (t) {
  t.equals(htmlOutput, template, 'should be equal')
  t.end()
})

test('navbar controller', function (t) {
  let c = controller[controller.length - 1]
  let ctrl = {}

  c.apply(ctrl, [HackerPouchServiceMock])
  t.ok(ctrl.getDocs, '$ctrl.getDocs should be set')

  t.end()
})
