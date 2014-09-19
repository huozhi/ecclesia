function sendReq(objId){
  var history = $('#' + objId);
  console.log(history);
  var postJson = {
    request : 'query-history-detail',
    "roomName" : history.children()[0].text,
    "host": history.children()[1].text,
    "date" : history.children()[2].text,
  };
  var postStr = JSON.stringify(postJson);
  $.ajax({
    url:'/history/query-history',
    type:'POST',
    contentType : 'application/json',
    dataType: 'json',
    data:postStr,
    success: function (data, status){
      if (!data) {
        data = {
          ChartList:[], SketchList:[], MarkdownList:[]
        }
      }
      $.cookie("ChartList",JSON.stringify(data.ChartList));
      $.cookie("SketchList",JSON.stringify(data.SketchList));
      $.cookie("MarkdownList",JSON.stringify(data.MarkdownList));
      window.location.href = "/history/history-detail";
    },
    error: function (data, status, e){
      alert(e);
    }
  });
}

function loadInfo(){
  $.post("/history/history-preview",
    function(data){
      data.forEach(
          function(value,index){
            var $section = $('<div />').addClass('div-container');
            var $historyNode = $('<div />').attr('id', 'history-' + index).addClass('list-group index');
            $historyNode.append($('<a />').addClass('list-group-item list-group-item-success').text('Meeting ' + index))
              .append($('<a />').addClass('list-group-item').text('Room Name: ' + value.roomName))
              .append($('<a />').addClass('list-group-item').text('Room Host: ' + value.host))
              .append($('<a />').addClass('list-group-item').text('Date: ' + value.date));
            $section.append($historyNode);
            $('.his-container').append($section);
          }
        );
      $('.index').click(function() {
        console.log('query history details');
        var historyIndex = $(this).attr('id');
        console.log(historyIndex);
        sendReq(historyIndex);
      });
  },"json");
}


var t;
var divW=$('.index').width();
var divH=$('.index').height();
var scale=1.01;
var objId;
function biging(obj){
  objId = obj;
  divW=scale*divW;
  divH=scale*divH;
  $("#"+obj).css('width',divW);
  $("#"+obj).css('height',divH);
  if(divW <= 305){
    t = setTimeout("biging(objId);",1);
  }
  else
    clearTimeout(t);
}
function smalling(obj){
  divW=280;
  divH=170;
  $("#"+obj).css('width',divW);
  $("#"+obj).css('height',divH);
}

$(document).ready(function() {
  
  var username = sessionStorage.getItem('username');
  if (!username) {
    window.location.href = "/";
  }
});