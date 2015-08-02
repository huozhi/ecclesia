'use strict'

/**
 * data structure will used defination
 * Discuss, Chart, Impress
 */

var Discuss = function(room, host, date, participants, topics) {
  this.room = room
  this.host = host
  this.date = date || new Date()
  this.participants = participants || []
  this.topics = topics || []
}

var Impress = function(srouce) {
  this.content = source
}

var Chart = function(type, labels, values) {
  this.type = type
  this.labels = labels
  this.values = values
  this.source = null
}


Discuss.prototype.info = function () {
  return {
    room: this.room,
    date: this.date,
    host: this.host
  }
}



Discuss.prototype.sync = function () {
  $.postJSON('/chat/',
    { info: this.info() },
    function (data) {

    }, 'json')
}


Chart.prototype.save = function () {
  $.postJSON('/chat/upload/chart',
    { data: this.data() },
    function (data) {
      if (data.response) {
        console.log('chart saved')
      }
    }, 'json')
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
  // RtcController.enableWebRTC()
  
})
