module.exports = {
  bindings: {
    stories: '<'
  },

  template: `
    <ul class='pagination'>
      <li ng-click='$ctrl.nextPage()'> <-- More --> </li>
    </ul>`,

  controller: ['HackerPouchService', controller]
}

function controller (HackerPouchService) {
  const $ctrl = this
  $ctrl.nextPage = () => HackerPouchService.fetchNextPage()
}
