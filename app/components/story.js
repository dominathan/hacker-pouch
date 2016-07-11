module.exports = {
  bindings: {
    story: '<',
    index: '<'
  },

  template: `
    <li class="story">
      <div class="story-title">
        <a href="{{$ctrl.story.url}}">
          <span class="story-index">{{$ctrl.index + 1}}.  </span>{{$ctrl.story.title}}
        </a>
      </div>
      <div class="story-info">
        <span>{{$ctrl.story.score}} by {{$ctrl.story.by}} at {{$ctrl.story.time}} | {{$ctrl.story.kids.length}} Comments </span>
      </div>
    </li>`
}
