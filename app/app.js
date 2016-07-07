var angular = require('angular')
require('angular-route')

var HackerPouchService = require('./services/hacker-pouch.service')
var RootComponent = require('./components/root')
var NavBarComponent = require('./components/navbar')
var StoryContainerComponent = require('./components/story-container')

angular
  .module('hacker-pouch', [
    'ngRoute'
  ])
  .factory('HackerPouchService', HackerPouchService)
  .component('root', RootComponent)
  .component('navbar', NavBarComponent)
  .component('storyContainer', StoryContainerComponent)
