Reveal.initialize({
  width: 800,
  height: 400,
  margin: 0.5,
  minScale: 1.0,
  maxScale: 1.0,
  center: true,
  transition: 'liner',
  transitionSpeed: 'fast',
  backgroundTransition: 'slide',

  dependencies: [
    { src: 'js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: 'js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    // { src: 'js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/math/math.js', async: true }
    ]  
});

Reveal.addEventListener( 'ready', function( event ) {
  var present = $('section.present');
  if (present.children('canvas').length != 0) {
    console.log('has canvas')
    var curCanvas = $('.present > canvas');
    if (!curCanvas.hasClass('sketch-present')) {
      // console.log('no active class')
      curCanvas.addClass('sketch-present');
    }
  }
  else {
    present.append('<canvas class="sketch sketch-present" width="800" height="400"></canvas>');
  }

    $('.sketch-present').Stroke(function (point) {
      webrtc.sendSketchPointData(point);
    });

});

Reveal.addEventListener( 'slidechanged', function( event ) {
  $('.sketch-present').removeClass('sketch-present');
  var present = $('.slides > section.present');
  if (present.children('canvas').length != 0) {
    // console.log('has canvas')
    var curCanvas = $('.present > canvas');
    if (curCanvas.hasClass('sketch-present') == false) {
      // console.log('no active class')
      curCanvas.addClass('sketch-present');
    }
  }
  else {
    present.append('<canvas class="sketch sketch-present" width="800" height="400"></canvas>');
  }
    $('.sketch-present').Stroke(function (point) {
      webrtc.sendSketchPointData(point);
    });
});

var genChart, prvwChart, genChartData;

$(document).ready(function() {
  $.fn.carousel.Constructor.prototype.keydown = function() { };
  $('slides').attr('zoom','1.0')

  $('#test-add-chart').click(function() {
    var addContent =
    '<div class="single-chart">' +
      '<canvas class="chart" width="180" height="180"></canvas>' +
      '<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>' +
    '</div>';
    $('#charts').append(addContent);
    var ctx = $('canvas.chart').last().get(0).getContext('2d');
    var pieData = [
      {
        value : 20,
        color : "#F38630",
        label : 'Sleep',
        labelColor : 'white',
        labelFontSize : '24'
      },
      {
        value : 30,
        color : "#E38231",
        label : 'Wocao',
        labelColor : 'white',
        labelFontSize : '24'
      },
      {
        value : 50,
        color : "#FFF630",
        label : 'Heihei',
        labelColor : 'white',
        labelFontSize : '24'
      },
      
    ];
    
    new Chart(ctx).Pie(pieData);
    $('.rm-chart').click(function() {
      // console.log('rm corresponding chart');

      $(this).parent().remove();
    });
  });

  $('.carousel').carousel({
    interval: false
  });

  // go to page fill blanks of chart data
  $('.add-opt').click(function() {
    var chart_t = $(this).attr('title');
    var previewCanvas = $('#chart-preview');
    
    previewCanvas.data('chart_t', chart_t);
    if (previewCanvas.attr('width') && previewCanvas.attr('height')) {
      // previewCanvas.get(0).getContext('2d').clearRect(0,0,300,300);
      // previewCanvas.attr({ width:"0", height:"0" });
      // console.log('cleart rect');
    }
    $('#chart-insert-carousel').carousel('next');
  });

  // back to choose charts
  $('#chart-data-submit').click(function() {
    var previewCanvas = $('#chart-preview');
    // previewCanvas.attr({ width:"0", height:"0" });
    // previewCanvas.get(0).getContext('2d').clearRect(0,0,300,300);
    genChart.destroy();
    $('#chart-insert-carousel').carousel('prev');

  });

  // preview chart
  $('#chart-data-add').click(function() {
    var len = $('.chart-insert').children('div').length;
    if (len > 2 && len < 6) {
      var nums = ['axis','one','two','three'];
      var inputForm = '<div class="input-group input-group-md col-md-8 col-md-offset-2">' +
        '<input type="text" class="form-control chart-data-input chart-data-val" placeholder="data">';
      var rmBtn = '<span class="input-group-btn"><button class="btn btn-primary rm-input-btn">' + 
                    '<span class="glyphicon glyphicon-remove"></span></button></span></div><br>'
      $(inputForm + rmBtn).insertBefore('.chart-btn');
    }
    $('.rm-input-btn').click(function() {
      var $parentDiv = $(this).parent().parent();
      $parentDiv.next().remove(); $parentDiv.remove();
    });

    listenChartDataInput();
  });

  listenChartDataInput();
  InsertGenChart();

});


function PreviewChart(labels, chart_t) {
  this.angularChartColors = [
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
  ];

  this.roundChartColors = ['#F38630','#E0E4CC','#69D2E7','#F7464A',
  '#E2EAE9','#D4CCC5','#949FB1','#4D5360'];

  this.types = ['line','bar','radar',
  'polar','pie','dougnut'];

  this.labels  = labels;
  this.chart_t = $('#chart-preview').data('chart_t');
  // this.datas   = datas   || [50];
}

PreviewChart.prototype.collectAttrs = function() {
  var self = this,
      chartData,
      columnData;      
  if (['line','bar','radar'].indexOf(self.chart_t) != -1) {
    var values = [];
    $('.chart-data-val').each(function(index, element) {
      columnData = $(this).val().split(' ').map(Number);
      
      values.push({
        fillColor : self.angularChartColors[index].fillColor,
        strokeColor: self.angularChartColors[index].strokeColor,
        pointColor: self.angularChartColors[index].pointColor,
        pointStrokeColor : "#fff",
        data: columnData
      });
    });
    chartData = {
      labels: self.labels,
      datasets: values
    };
    // console.log('labels',self.labels);
    // console.log('datasets',chartData.datasets.length);
  } else {
    chartData = [];
    $('.chart-data-val').each(function(index, element) {
      columnData = $(this).val().split(' ').map(Number);
      columnData.forEach(function (data, i) {
        chartData.push({
          value : data,
          color : self.roundChartColors[i],
          label : self.labels[i],
          labelColor : 'white',
          labelFontSize : '24'
        });
      });
    });
  }
  return chartData;
}

PreviewChart.prototype.sketchPreviewChart = function(selector, data) {
  var chartData = data || this.collectAttrs();
  var previewCtx = selector.get(0).getContext('2d');
  switch (this.chart_t) {
    case 'line':
      genChart = new Chart(previewCtx).Line(chartData);
      break;
    case 'bar':
      genChart = new Chart(previewCtx).Bar(chartData);
      break;
    case 'radar':
      genChart = new Chart(previewCtx).Radar(chartData);
      break;
    case 'polararea':
      genChart = new Chart(previewCtx).PolarArea(chartData);
      break;
    case 'pie':
      genChart = new Chart(previewCtx).Pie(chartData);    
      break;
    case 'dougnut':
      genChart = new Chart(previewCtx).Doughnut(chartData);
      break;
    default:
      break;
  }
  genChartData = chartData;
  $('#charts').data('newest', chartData);
  $('#charts').data('chart_t', this.chart_t);
}

function listenChartDataInput() {
// preview chart to insert
  $('.chart-data-input').dblclick(function() {
    $('#chart-preview').attr({ width:"300", height:"300" });
    var inputLabels = $('.chart-data-axis').val().split(' ');
    if (!inputLabels.length) {
      window.console.log('empty axis');
      return;
    }
    var chart_t = $('#chart-preview').data('chart_t');
    prvwChart = new PreviewChart(inputLabels, chart_t).sketchPreviewChart($('#chart-preview'));
  });
}

function InsertGenChart() {
  $('#insert-btn').click(function() {
    var addContent =
    '<div class="single-chart">' +
      '<canvas class="chart" width="180" height="180"></canvas>' +
      '<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>' +
    '</div>';
    var charts = $('#charts');
    charts.append(addContent);
    var ctx = $('canvas.chart').last().get(0).getContext('2d');
    new PreviewChart(genChartData, charts.data('chart_t'))
    .sketchPreviewChart($('canvas.chart').last(), genChartData);
    $('.rm-chart').click(function() {
      // console.log('rm corresponding chart');

      $(this).parent().remove();
    });
    $('#add-chart-modal').modal('hide');
  });
}

var mySwiper = new Swiper('.swiper-container',{
  pagination: '.pagination',
  paginationClickable: true,
  freeMode: true,
  freeModeFluid: true
})