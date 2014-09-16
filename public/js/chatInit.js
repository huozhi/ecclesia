var genChart, prvwChart, genChartData;


function enableChartPreview (webrtc) {

$(document).ready(function() {
  $.fn.carousel.Constructor.prototype.keydown = function() { };
  $('slides').attr('zoom','1.0');

  $('.carousel').carousel({
    interval: false
  });

  // go to page fill blanks of chart data
  $('.add-opt').click(function() {
    var chart_t = $(this).attr('title');
    var previewCanvas = $('#chart-preview');
    
    previewCanvas.data('chart_t', chart_t);
    $('#chart-insert-carousel').carousel('next');
  });

  // back to choose charts
  $('#chart-data-submit').click(function() {
    var previewCanvas = $('#chart-preview');
    if (genChart) genChart.destroy();
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

PreviewChart.prototype.sketchPreviewChart = function(selector, data, callback) {
  var chartData = data || this.collectAttrs();
  var previewCtx = selector.get(0).getContext('2d');
  var base64code;
  switch (this.chart_t) {
    case 'line':
      genChart = new Chart(previewCtx).Line(chartData);
      base64code = genChart.toBase64Image();
      break;
    case 'bar':
      genChart = new Chart(previewCtx).Bar(chartData);
      base64code = genChart.toBase64Image();
      break;
    case 'radar':
      genChart = new Chart(previewCtx).Radar(chartData);
      base64code = genChart.toBase64Image();
      break;
    case 'polararea':
      genChart = new Chart(previewCtx).PolarArea(chartData);
      base64code = genChart.toBase64Image();
      break;
    case 'pie':
      genChart = new Chart(previewCtx).Pie(chartData);    
      base64code = genChart.toBase64Image();
      break;
    case 'dougnut':
      genChart = new Chart(previewCtx).Doughnut(chartData);
      base64code = genChart.toBase64Image();
      break;
    default:
      break;
  }
  genChartData = chartData;
  $('#charts').data('newest', chartData);
  $('#charts').data('chart_t', this.chart_t);
  if (typeof callback == 'function') {
    callback(genChart.toBase64Image(), 'chart', selector.length - 1, function (newChartData) {
      console.log('toBase64Image', genChart.toBase64Image());
      webrtc.signalSyncChart(newChartData);
    });
  }
}

function listenChartDataInput() {
// preview chart to insert
  $('.chart-data-input').dblclick(function() {
    $('#chart-preview').attr({ width:"180", height:"180" });
    var inputLabels = $('.chart-data-axis').val().split(' ');
    if (!inputLabels.length) {
      window.console.log('empty axis');
      return;
    }
    var chart_t = $('#chart-preview').data('chart_t');
    new PreviewChart(inputLabels, chart_t).sketchPreviewChart($('#chart-preview'));
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
    var previewBase64 = genChart.toBase64Image();
    charts.append(addContent);
    var $allCharts = $('canvas.chart');
    var ctx = $allCharts.last().get(0).getContext('2d');
    new PreviewChart(genChartData, charts.data('chart_t'))
    .sketchPreviewChart($allCharts.last(), genChartData);
    // upload new chart
    var $allCharts = $('canvas.chart');
    saveImage(previewBase64, 'chart', $allCharts.length - 1, function (newChartData) {
      webrtc.signalSyncChart(newChartData);
    });
    
    $('.rm-chart').click(function() {
      $(this).parent().remove();
    });
    $('#add-chart-modal').modal('toggle');
  });
}

var mySwiper = new Swiper('.swiper-container',{
  pagination: '.pagination',
  paginationClickable: true,
  freeMode: true,
  freeModeFluid: true
});

}