'use strict'

/**
 * data structure will used defination
 * Discuss, Chart, Impress
 */
var $slides = $('#slides')
var $addSlide = $('#addSlide')
var $carousel = $('#impress')
var $slidesNav = $('#impress ol')
var $editBoard = $('.edit-board')
var $edit = $('.edit')

var $slideTitle = $('#slideTitle')
var $slideContent = $('#slideContent')


/******* SLIDES *******/
var Impress = {
  slides: [{
      title: "Welcome to Ecclesia",
      content: "you could edit your slides here... ",
    },
  ],
  init: function() {
    $.fn.carousel.Constructor.prototype.keydown = function(){}

    var self = this
    this.slides.forEach(function(item, idx) {
      self.append(idx, item)
    })

    $addSlide.click(function() {
      if ($editBoard.css('display') === 'block')
        return
      self.slides.push({
        title: "# new",
        content: ''
      })
      var last = self.slides.length - 1
      self.append(last, self.slides[last])
      self.render(last)
      $carousel.carousel(last)
    })
    self.renderAll()
  },
  render: function(pageId) {
    var $slide = $('div[data-id=' + pageId + ']')
    var slideObj = this.slides[pageId]
    $slide.children('h1').text(slideObj.title)
    $slide.children('.slide-content').html(
      marked(slideObj.content)
    )
  },
  renderAll: function() {
    var $mark = $('.slide-content')
    $mark.each(function (index, ele) {
      var $this = $(ele)
      var text = marked($this.text())
      $this.html(text)
    })
  },
  append: function(idx, slide) {

      // add navigator
      $('<li/>', {
        class: idx === 0 ? 'active' : ''
      })
      .attr('data-target', '#impress')
      .attr('data-slide-to', idx)
      .appendTo($slidesNav)

      // add content
      var $slideItem = $('<div/>', {
        class: idx === 0 ? 'item active' : 'item'
      })
      .attr('data-id', idx)
      .appendTo($slides)

      $('<h1/>')
      .text(slide.title)
      .appendTo($slideItem)

      $('<div/>', {
        class: 'text-center center-block slide-content'
      })
      .html(marked(slide.content))
      .appendTo($slideItem)
  },
  edit: function(pageId) {
    var shown, pageId, $li
    shown = $editBoard.css('display')
    $li = $slidesNav.children().filter('.active')
    pageId = $li.data('slide-to')
    if (shown === 'none') {
      $slides.hide()
      $editBoard.show()
      // assign text
      var slide = Impress.slides[pageId]
      $slideTitle.val(slide.title)
      $slideContent.val(slide.content)
    }
    else {
      $slides.show()
      $editBoard.hide()
      Impress.slides[pageId].title = $slideTitle.val()
      Impress.slides[pageId].content = $slideContent.val()
      Impress.render(pageId)
    }
  }
}

/******* SLIDES *******/


/******* DISCUSS *******/

var Discuss = function(room, host, date, participants, topics) {
  this.room = room
  this.host = host
  this.date = date || new Date()
  this.participants = participants || []
  this.topics = topics || []
}

Discuss.info = function () {
  return {
    room: this.room,
    date: this.date,
    host: this.host
  }
}

Discuss.init = function() {
  $('#mediaOpts').click(function() {
    MediaTool.check()
  })

  $edit.click(Impress.edit)
}

Discuss.sync = function () {
  $.post('/chat/sync', { info: this.info() })
}

/******* DISCUSS *******/



/******* CHART ********/

var Chart = function(type, labels, values) {
  this.type = type
  this.labels = labels
  this.values = values
  this.source = null
}


Chart.prototype.save = function () {
  $.post('/chat/upload/chart', { data: this.data() })
}

Chart.prototype.data = function () {
  return {
    type: this.type,
    labels: this.labels,
    values: this.values
  }
}


Chart.prototype.generate = function () {
  if (this.source) {
    this.source.clear()
  }
  var context = this.selector.get(0).getContext('2d')
  this.source = new Chart(context)
  switch (this.chart_t) {
    case 'line':
      this.source.Line(chartData)
      break
    case 'bar':
      this.source.Bar(chartData)
      break
    case 'pie':
      this.source.Pie(chartData)
      break
    default:
      break
  }
}


Chart.angularChartColors = [
  {
    fillColor: 'rgba(220,220,220,0.5)',
    strokeColor: 'rgba(220,220,220,1)',
    pointColor: 'rgba(220,220,220,1)',
  },
  {
    fillColor: 'rgba(151,187,205,0.5)',
    strokeColor: 'rgba(151,187,205,1)',
    pointColor: 'rgba(151,187,205,1)',
  },
  {
    fillColor: 'rgba(0,0,0,0.5)',
    strokeColor: 'rgba(0,0,51,1)',
    pointColor: 'rgba(0,0,102,1)',
  }
]

Chart.roundChartColors = ['#F38630','#E0E4CC','#69D2E7','#F7464A',
  '#E2EAE9','#D4CCC5','#949FB1','#4D5360']


/******* CHART ********/





$(document).ready(function() {
  Impress.init()
  Discuss.init()
})
