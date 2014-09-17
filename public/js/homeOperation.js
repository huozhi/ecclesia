$(document).ready(function() {
  $("#create-room-btn").click(function() {
    var roomName = $('#create-room-name').val();
    
    $.ajax({
      url:'/home/create-room',
      type: 'POST',
      contentType:'application/json',
      dataType: 'json',
      data: JSON.stringify({
        request: 'create-room',
        roomName: roomName
      }),
      success: function (data) {
        console.log(data);
        if (data.response === 'create-success') {
          var username = sessionStorage.getItem('username');
          sessionStorage.setItem('roomName', data.roomName),
          sessionStorage.setItem('creator', data.creator),
          sessionStorage.setItem('roomHash', data.roomHash);
          sessionStorage.setItem('isHost', data.creator === username);
          window.location.href = '/chat';
        }
        else {
          console.log(data.response);
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

  $(".add-user").click(function(){
    var username = $(".user-input").val();
    if (username != "") {
      var str = '<li class="list-group-item">' + username + '<span class="glyphicon glyphicon-remove" id="' + username + '" style="float:right;"></span></li>'
      $(".list-group").append(str);
      $(".user-input").val("");
    }
    $("#"+ username).click(function(){
      var obj = $("#" + username).parent();
      obj.remove();
    });
  });

});