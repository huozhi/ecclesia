function loadInfo(){
  $.post("/history/history-preview",
    function(data){
      data.forEach(
          function(value,index){
            $(".his-container").append('<div class="div-container"><div id="history-'+index+'" class="index" onmouseenter="biging(this.id);" onmouseleave="smalling(this.id);" onclick="sendReq(this.id);"><table style="color:#000;" class="table table-striped"><tr><td>Room name:</td><td>'+value.roomName+'</td></tr><tr><td>Host:</td><td>'+value.host+'</td></tr><td>Date:</td><td>'+value.date+'</td></tr></table></div></div>');
          }
        );
  },"json");
}
function sendReq(objId){
  var tableArr = document.getElementById(objId).firstChild.firstChild.getElementsByTagName('tr');
  var postJson = {
    request : 's',
    "roomName" : tableArr[0].children[1].innerHTML,
    "host": tableArr[1].children[1].innerHTML,
    "date" : tableArr[2].children[1].innerHTML,
  };
  var postStr = JSON.stringify(postJson);
  $.ajax({
    url:'/history/query-history',
    type:'POST',
    contentType : 'application/json',
    dataType: 'json',
    data:postStr,
    success: function (data, status){
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