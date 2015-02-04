$(document).ready(function() {
  $("#create-room-btn").click(function() {
    var room = $('input[name="create-room"]').val();
    var topics = [];
    $('.outline-list > ul > li').each(function() {
      topics.push( $(this).text() );
    });
    
    $.postJSON('/home/create', {
        request: 'create-room',
        room: room,
        topics: topics
      },
      function (conference) {
        console.log(conference);
        if (conference.response) {
          var username = sessionStorage.getItem('username');
          sessionStorage.setItem('room', conference.room),
          sessionStorage.setItem('creator', conference.creator),
          sessionStorage.setItem('roomHash', conference.roomHash);
          sessionStorage.setItem('date', conference.date);
          sessionStorage.setItem('isHost', conference.creator === username);
          window.location.href = '/chat';
        }
        else {
          console.log(conference.response);
        }
      }, 'json');
  });
  $('#join-room-btn').click(function() {
    var room = $('input[name="join-room"]').val(),
        host = $('input[name="room-host"]').val();
    
    $.postJSON('/home/join', {
        request: 'join-room',
        room: room,
        host: host
      },
      function (data) {
        if (data.response) {
          sessionStorage.setItem('room', data.room),
          sessionStorage.setItem('creator', data.creator),
          sessionStorage.setItem('roomHash', data.roomHash);
          var username = sessionStorage.getItem('username');
          sessionStorage.setItem('isHost', data.creator === username);
          window.location.href = '/chat';
        }
        else {
          console.log(data.response);
        }
      }, 'json');
  });

  $('.add-outline').click(function(){
    var $topic_input = $('.outline-input');
    var topic = $topic_input.val();
    if (topic) {
      var $outline_li = $('<li />')
          .addClass('list-group-item')
          .text(topic)
          .append(
            $('<button />')
            .addClass('btn btn-default btn-sm')
            .css('float', 'right')
            .append(
              $('<span />')
              .addClass('glyphicon glyphicon-remove')
              .css('float', 'right')
            )
          );

      $('.list-group').append($outline_li);
      $topic_input.val("");
      $('.list-group-item > button').click(function(){
        $(this).parent().remove();
      });
    }
  });

});