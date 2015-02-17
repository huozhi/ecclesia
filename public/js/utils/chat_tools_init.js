var genChart, prvwChart, genChartData;


function saveImage(base64code, _eleType, _page, callback) {
  // var $ele = _ele;
  // var base64code = _ele.get(0).toDataURL();
  // console.log(base64code);

  var imageType;
  switch (_eleType) {
    case 'chart':
      window.console.log('save chart');
      imageType = 'chart';
      break;
    case 'sketch':
      window.console.log('save sketch');
      imageType = 'sketch';
      break;
  }
  $.ajax({
    url: '/chat/upload-img',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      request: imageType,
      page: _page,
      img: lzw_compress( base64code )
    }),
    success: function(data) {
      var objectId = data.objectId,
          saveImgType = data.imgType;
      console.log(data.response, objectId, saveImgType);
      if (typeof callback === 'function') {
        callback({objectId:objectId, imgType:saveImgType});
      }
    },
    err: function(err) {
      alert(err);
    }
  });
}



// function chatInitialize () {

$(document).ready(function() {
  // enableWebRTC();
  


  
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
    // if (genChart) genChart.destroy();
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
  insertChart();

  // getOutlines();
});


var mySwiper = new Swiper('.swiper-container',{
  pagination: '.pagination',
  paginationClickable: true,
  freeMode: true,
  freeModeFluid: true
});

// }

function getOutlines () {
  var roomName, creator, date;
  roomName = sessionStorage.getItem('roomName');
  creator  = sessionStorage.getItem('creator');
  date     = sessionStorage.getItem('date');

  $.ajax({
    url: '/chat/query-outline',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      roomName: roomName,
      creator: creator,
      date: date, 
    }),
    success: function (data) {
      console.log(data);
      sessionStorage.setItem('outline', data.outline);
      data.outline.forEach(function (topics, index) {
        $('.outline-block > ul').append('<li class="list-group-item">'+topics+'</li>');
      });
      manageTools(); // for every one
      var isHost = sessionStorage.getItem('isHost');
      console.log('isHost',isHost);
      if (isHost === 'true') {
        initOutlineClickEvent(webrtc);
      }
    },
    error: function (data, status, err) {
      console.log(err);
    }
  });
}

function getOutlineFoucs(recvOutlineText) {
  $('.list-group').each(function() {
    if ($(this).text() == recvOutlineText) {
      $(".list-group").children("li").css("background-color","#fff");
      $(".list-group").children("li").css("color","#000");
      $(this).css("background-color","#a8a8a8");
      $(this).css("color","#fff");
    }
  });
}

/* initOutlineClickEvent */
function initOutlineClickEvent() {
  $(".list-group-item").click(function(){
    var outlineText = $(this).text();
    // webrtc send
    webrtc.sendOutlineText(outlineText);

    $(".list-group").children("li").css("background-color","#fff");
    $(".list-group").children("li").css("color","#000");
    $(this).css("background-color","#a8a8a8");
    $(this).css("color","#fff");
  });
}

function manageTools() {
  $(".preview").click(function(){
    $(".preview-block").slideDown();
    $(".tools-block").slideUp();
    $(".outline-block").slideUp();
  });
  $(".tools").click(function(){
    $(".preview-block").slideUp();
    $(".tools-block").slideDown();
    $(".outline-block").slideUp();
  });
  $(".outline").click(function(){
    $(".preview-block").slideUp();
    $(".tools-block").slideUp();
    $(".outline-block").slideDown();
  });
  $(".glyphicon-trash").click(clearSketch);
  $(".glyphicon-ban-circle").click(binSketch);
  $(".glyphicon-pencil").click(enableSketch);
}

/* manageSketch */
function clearSketch() {
  var currSlide  = $(Reveal.getCurrentSlide()),
      currSkect  = currSlide.find('canvas');
  currSkect[0].width = 0;
  currSkect[0].height = 0;
  currSkect[0].width = 800;
  currSkect[0].height = 400;
}
function binSketch(){
  $("section").append('<div class="bin-sketch" width="800" height="400"></div>');
}
function enableSketch(){
  $(".bin-sketch").remove();
}

/* end initOutlineClickEvent */

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


function insertChart() {
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
