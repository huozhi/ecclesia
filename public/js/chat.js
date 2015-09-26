'use strict'

/**
 * data structure will used defination
 * Discuss, Chart, Impress
 */

var $slides = $('#slides')
var $addSlide = $('#addSlide')
var $carousel = $('#impress')
var $slidesNav = $('#impress ol')

var Discuss = function(room, host, date, participants, topics) {
  this.room = room
  this.host = host
  this.date = date || new Date()
  this.participants = participants || []
  this.topics = topics || []
}

var Impress = {
  content: [
    "# Welcome to Ecclesia",
    "# slide 2",
  ],
  init: function() {
    var self = this
    this.content.forEach(function(text, idx) {
      self.append(idx, text)
    })

    $addSlide.click(function() {
      var last = self.content.length
      var text = '#hehe'
      self.content.push(text)
      self.append(last, text)
      self.render(last)
      $carousel.carousel(last)
    })
    self.renderAll()
  },
  render: function(pageId) {
    var $slide = $('div[data-id=' + pageId + ']')
    console.log($slide.text())
    $slide.html(marked($slide.text()))
  },
  renderAll: function() {
    var $mark = $('.item')
    $mark.each(function (index, ele) {
      var $this = $(ele)
      console.log($this.text())
      var text = marked($this.text())
      $this.html(text)
    })

    // $('.edit').click(function () {
    //   var $self = $(this)
    //   var $cover = $self.next('.cover-board');
    //   // console.log($cover)
    //   if ($cover.css('display') === 'none') {
    //     $cover.css('display', 'block')
    //   }
    //   else {
    //     $cover.css('display', 'none')

    //   }
    // })
  },
  append: function(idx, text) {
      // add navigator
      $('<li/>', {
        class: idx === 0 ? 'active' : ''
      })
      .attr('data-target', '#impress')
      .attr('data-slide-to', idx)
      .appendTo($slidesNav)

      // add content
      $('<div/>', {
        class: idx === 0 ? 'item active' : 'item'
      })
      .text(text)
      .attr('data-id', idx)
      .appendTo($slides)
      
      // this.render(idx)
  },
  edit: function(id) {

  }
}

var Chart = function(type, labels, values) {
  this.type = type
  this.labels = labels
  this.values = values
  this.source = null
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
}

Discuss.sync = function () {
  $.post('/chat/sync',
    { info: this.info() },
    function (response) {
      console.log(response)
    })
}


Chart.prototype.save = function () {
  $.post('/chat/upload/chart',
    { data: this.data() },
    function (response) {
      console.log(response)
    })
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
    // this.source.destroy()
  }
  // var chartData = data || this.collectAttrs()
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


Chart.prototype.angularChartColors = [
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

Chart.prototype.roundChartColors = ['#F38630','#E0E4CC','#69D2E7','#F7464A',
  '#E2EAE9','#D4CCC5','#949FB1','#4D5360']




$(document).ready(function() {
  Impress.init()
  Discuss.init()
  // RtcController.enableWebRTC()
  
})
