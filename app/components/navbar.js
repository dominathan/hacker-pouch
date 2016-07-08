module.exports = {
  bindings: {

  },

  controller: function (HackerPouchService) {
    const $ctrl = this

    $ctrl.getDocs = function(word) {
      console.log("AM I WORKING", word)
      HackerPouchService.getNews(word)
    }
  },

  template: `
    <header>
      <nav>
        <h2 ng-click="$ctrl.getDocs('best')">Hacker Pouch</h2>
        <ul>
          <li ng-click="$ctrl.getDocs('new')"> new </li> |
          <li ng-click="$ctrl.getDocs('top')"> top </li> |
          <li ng-click="$ctrl.getDocs('show')"> show </li> |
          <li ng-click="$ctrl.getDocs('ask')"> ask </li> |
          <li ng-click="$ctrl.getDocs('job')"> jobs </li> |
          <li> submit </li>
      </nav>
    </header>
  `
}
