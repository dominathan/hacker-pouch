module.exports = {
  bindings: {
    story: '<'
  },

  controller: function() {
    const $ctrl = this
  },

  template: `
    <li class="story">
      <div class="story-title">
        <a href="{{$ctrl.story.data.url}}">{{$ctrl.story.data.title}}</a>
      </div>
      <div class="story-info">
        <span>{{$ctrl.story.data.score}} by {{$ctrl.story.data.by}} at {{$ctrl.story.data.time * 1000}} | {{$ctrl.story.data.descendents.length}} Comments
      </div>
    </li>
  `
}
