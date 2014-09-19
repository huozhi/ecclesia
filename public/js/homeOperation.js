$(document).ready(function() {
  $("#create-room-btn").click(function() {
    var roomName = $('#create-room-name').val();
    var outline = [];
    $('.outline-list > ul > li').each(function() {
      outline.push( $(this).text() );
    });
    // console.log(outline);
    $.ajax({
      url:'/home/create-room',
      type: 'POST',
      contentType:'application/json',
      dataType: 'json',
      data: JSON.stringify({
        request: 'create-room',
        roomName: roomName,
        outline: outline
      }),
      success: function (conference) {
        console.log(conference);
        if (conference.response === 'create-success') {
          var username = sessionStorage.getItem('username');
          sessionStorage.setItem('roomName', conference.roomName),
          sessionStorage.setItem('creator', conference.creator),
          sessionStorage.setItem('roomHash', conference.roomHash);
          sessionStorage.setItem('date', conference.date);
          sessionStorage.setItem('isHost', conference.creator === username);
          window.location.href = '/chat';
        }
        else {
          console.log(conference.response);
        }
      }
    });
  });
  $('#join-room-btn').click(function() {
    var roomName = $('#join-room-name').val(),
        host = $('#join-room-host').val();
    
    $.ajax({
      url:'/home/join-room',
      type: 'POST',
      contentType:'application/json',
      dataType: 'json',
      data: JSON.stringify({
        request: 'join-room',
        roomName: roomName,
        host: host
      }),
      success: function (data) {
        if (data.response === 'join-success') {
          sessionStorage.setItem('roomName', data.roomName),
          sessionStorage.setItem('creator', data.creator),
          sessionStorage.setItem('roomHash', data.roomHash);
          var username = sessionStorage.getItem('username');
          sessionStorage.setItem('isHost', data.creator === username);
          window.location.href = '/chat';
        }
        else {
          console.log(data.response);
        }
      }
    });
  });

  $(".add-outline").click(function(){
    var outline = $(".outline-input").val();
    if (outline != "") {
      var outlineItem = '<li class="list-group-item">' + outline + '<span class="glyphicon glyphicon-remove" id="' 
      + outline + '" style="float:right;"></span></li>'
      $(".list-group").append(outlineItem);
      $(".outline-input").val("");
    }
    $("#"+ outline).click(function(){
      var obj = $("#" + outline).parent();
      obj.remove();
    });
  });

});