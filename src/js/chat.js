'use strict'

const utils = require('./utils')
const MediaTool = require('./media-tool')
const RtcController = require('./chat_webrtc')

const SYNC_INTERVAL = 1000 * 20

/**
 * data structure will used defination
 * Discuss, Chart, Impress
 */
var $slides = $('#slides')
var $addSlide = $('#addSlide')
var $carousel = $('#impress')
var $slidesNav = $('#impress ol')
var $editBoard = $('#editBoard')
var $slideEdit = $('#slideEdit')
var $slideContent = $('#slideContent')

/******* SLIDES *******/
var Impress = {
  slides: [
    '# Welcome to Ecclesia\nyou could edit your slides here... '
  ],
  init: function() {
    $.fn.carousel.Constructor.prototype.keydown = function(){};

    this.slides.forEach((item, idx) => {
      this.append(idx, item)
    });

    var query = utils.parseQuery()
    this.room = query.room
    this.host = query.host
    this.self = query.self

    $addSlide.click(() => {
      if ($editBoard.css('display') !== 'block') {
        this.slides.push('# new')
        const lastIndex = this.slides.length - 1
        this.append(lastIndex, this.slides[lastIndex])
      }
    })
    this.renderAll()

    setInterval(() => this.sync(), SYNC_INTERVAL)
  },
  sync: function() {
    const slides = this.slides

    $.post('/chat/sync', {
      slides: slides,
      discussId: this.room,
    })
  },
  render: function(pageId) {
    var $slide = $('div[data-id=' + pageId + ']')
    var slide = this.slides[pageId]
    $slide.children('.slide-content').html(
      marked(slide)
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

      $('<div />', {
        class: 'text-center center-block slide-content'
      })
      .html(marked(slide))
      .appendTo($slideItem)

      // marked and navigate to it
      this.render(idx)
      this.sync()
      $carousel.carousel(idx)
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
      var slide = this.slides[pageId]
      $slideContent.val(slide)
    }
    else {
      $slides.show()
      $editBoard.hide()

      this.slides[pageId] = $slideContent.val()
      this.render(pageId)
      this.sync()
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

  $slideEdit.click(Impress.edit)
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

function ChartPageController() {
  RtcController.enableWebRTC()
  Impress.init()
  Discuss.init()
}

window.addEventListener('load', ChartPageController)
