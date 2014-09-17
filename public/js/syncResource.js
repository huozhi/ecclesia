$(document).ready(function() {
  $.cookie('sketchChanged',false);
  $("#media-check-btn").click(function(){
    $("#check-media-modal").checkMedia(function (constrains) {
      $('#enter-room-btn').click(function() {
        enableWebRTC(constrains);
      })
    });
  }).click();

  // sync charts in loading page
  syncCharts();
  // sync impress in loading page
  syncImpress();
  syncPreview();
  // $(".btn-refresh").click(function(){
  // });
});


function syncImpress() {
  var syncReq = {
    request: 'impress'
  };
  $.ajax({
    url: '/chat/query-meeting-markdown',
    type: 'POST',
    contentType : 'application/json',
    dataType: 'json',
    data: JSON.stringify(syncReq),
    success: function (data) {
      if (!data.mdAdd) return;
      var markdownArr = data.mdAdd;
      createImpress(markdownArr);
    },
    error: function (data, status, err) { alert(err); }
  });
}

function createImpress(markdownArr) {
  var slides = $('.slides');
  markdownArr.forEach(function (markdown, index) {
    var $mdScript = $("<script />", {
              html: markdown,
              type: "text/template"
            });
    var $section = $('<section data-markdown></section>').append(mdScript);
    slides.append($section);
  });
  RevealMarkdown.reinit();
}

function syncPreview() {
  var syncReq = {
    request: 'preview'
  };
  $.ajax({
    url: '/chat/query-preview-markdown',
    type: 'POST',
    contentType : 'application/json',
    dataType: 'json',
    data: JSON.stringify(syncReq),
    success: function (data) {
      if (!data.previewDict) return;
      var dict = data.previewDict;
      dict.forEach(function (userPreview, index) {
        var previewCntrId = 'preview_' + userPreview.author;
        var $mdScript = $('<script />', {
                html: userPreview,
                type: 'text/template'
        });
        var $section = $('<section data-markdown></section>').append($mdScript);
        $(previewCntrId).children().remove();
        $(previewCntrId).append($section);
      });
      RevealMarkdown.reinit();
    }
  });
}

function syncCharts() {
  var requestJson = {
    request : 'chart'
  }
  requestJson = JSON.stringify(requestJson);
  $.ajax({
    url:'/chat/refresh-img',
    type:'POST',
    contentType : 'application/json',
    dataType: 'json',
    data:requestJson,
    success: function (data, status){
      if (!data.SketchList) return;
       // console.log(JSON.stringify(data.ChartList));
      data.ChartList.forEach(function(value,index){
        var chart = {
          request : 'refresh-img',
          id : value.id,
        }
        var postData = JSON.stringify(chart);
        $.ajax({
          url:'/chat/query-img',
          type:'POST',
          contentType : 'application/json',
          dataType: 'json',
          data:postData,
          success: function (data, status){
            $(".swiper-slide").append('<img id="chart-' + data.image.page + '" src="' + lzw_uncompress(data.image.img) + '"/>');
          },
          error: function (data, status, err){
            console.log(err);
          }
        });//end ajax
      });//end forEach
    },
    error: function (data, status, err){
      console.log(err);
    }
  });//end ajax
}