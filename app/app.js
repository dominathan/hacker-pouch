var angular = require('angular')
require('angular-route')

var HackerPouchService = require('./services/hacker-pouch.service')
var RootComponent = require('./components/root')

angular
  .module("hacker-pouch",[
    'ngRoute'
  ])
  .factory('HackerPouchService', HackerPouchService)
  .component('root', RootComponent)
