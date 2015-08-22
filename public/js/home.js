// $(document).ready(function() {
//   $("#createRoom").click(function() {
//     var room = $('input[name="create-room"]').val();
//     var topics = [];
//     $('.outline-list > ul > li').each(function() {
//       topics.push( $(this).text() );
//     });
    
//     $.postJSON('/home/create', {
//         request: 'create-room',
//         room: room,
//         topics: topics
//       },
//       function (discuss) {
//         console.log(discuss);
//         if (discuss.response) {
//           var username = sessionStorage.getItem('username');
//           var info = {
//             'room': discuss.room,
//             'host': discuss.host,
//             'date': discuss.date,
//             'ishost': discuss.host === username
//           };
//           for (var key in info)
//             sessionStorage.setItem(key, info[key]);
//           window.location.href = '/chat';
//         }
//         else {
//           console.log(discuss.response);
//         }
//       }, 'json');
//   });
//   $('#joinRoom').click(function() {
//     var room = $('input[name="join-room"]').val(),
//         host = $('input[name="room-host"]').val();
    
//     $.postJSON('/home/join', {
//         request: 'join-room',
//         room: room,
//         host: host
//       },
//       function (discuss) {
//         if (discuss.response) {
//           var username = sessionStorage.getItem('username');
//           sessionStorage.setItem('room', discuss.room),
//           sessionStorage.setItem('host', discuss.host),
//           sessionStorage.setItem('ishost', discuss.host === username);
//           window.location.href = '/chat';
//         }
//         else {
//           console.log(discuss.response);
//         }
//       }, 'json');
//   });

//   $('#addTopic').click(function(){
//     var $input = $('input[name="topic"]');
//     var content = $input.val();
//     if (content.length) {
//       var $topic = $('<li />').addClass('list-group-item').text(content);
//       var $rmbtn = $('<span />').addClass('glyphicon glyphicon-remove').css('float', 'right');
//       $topic.append($rmbtn);

//       $('#topics').append($topic);
//       $input.val('');
//       $('.list-group-item > span').click(function(){
//         $(this).parent().remove();
//       });
//     }
//   });

// });