var angular = require('angular')
var _ = require('lodash')

var HackerPouchService = require('./services/hacker-pouch.service')
var PouchDBService = require('./services/pouch-db.service')
var RootComponent = require('./components/root')
var NavBarComponent = require('./components/navbar')
var StoryContainerComponent = require('./components/story-container')
var StoryComponent = require('./components/story')

angular
  .module('hacker-pouch', [])
  .factory('PouchDBService', PouchDBService)
  .factory('HackerPouchService', HackerPouchService)
  .component('root', RootComponent)
  .component('navbar', NavBarComponent)
  .component('storyContainer', StoryContainerComponent)
  .component('story', StoryComponent)
