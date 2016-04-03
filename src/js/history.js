var History = function() { }

History.markedAll = function () {
  var $mark = $('.item')
  $mark.each(function (index, ele) {
    var $this = $(ele)
    var text = marked($this.text()).trim()
    $this.html(text)
  })
}

$(document).ready(function() {
  History.markedAll()
})
