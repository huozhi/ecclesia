var room = location.search && location.search.split('?')[1];

var webrtc = new SimpleWebRTC({
  // url: "http://localhost:8888",
  localVideoEl: 'local-video',
  remoteVideoEl: 'all-videos',
  autoRequestMedia: true,
  debug: false,
  detectSpeakingEvents: true,
  autoAdjustMic: false
});

webrtc.on('readyToCall', function() {
  if (room) webrtc.joinRoom(room);
});

webrtc.on('videoAdded', function (video, peer) {
  var remotes = $('.sidebar');
  var addPeer = $(document.createElement('div'));
  var volBar  = $(document.createElement('div'));
  volBar.addClass('vol-var');
  addPeer.append(volBar);
  addPeer.addClass('video-frame');
  addPeer.attr('id', 'video_' + webrtc.getDomId(peer));
  addPeer.append(video);
  remotes.append(addPeer);
});

webrtc.on('videoRemoved', function (video, pper) {
  var remotes = $('.sidebar');
  var leavePeer = $('#video_' + webrtc.getDomId(peer));
  if (remotes && leavePeer) {
    leavePeer.remove();
  }
})

webrtc.on('volumeChange', function (volume, threshold) {
  var volBar = $('#localVolBar');
  if (volBar == []) return;
  if (volume < -45) { // vary between -45 and -20
    volBar.css('height', '0px');
  } else if (volume > -20) {
    volBar.css('height', '100%');
  } else {
    volBar.css('height', '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%');
  }
});

webrtc.on('rtcSyncStroke', function (point) {
  // console.log('syncStroke event');
  $('.sketch-present').syncStroke(point);
});

if (!room) {
  $('#create-room-btn').click(function () {
    // use uuid to create room, pass null to first arg
    webrtc.createRoom(null, function (err, name) {
      var roomUrl = location.pathname + '?' + name;
      if (!err) {
        history.replaceState(null, null, roomUrl);
      }
    })
  })
} else {
  console.log('already in a room');
}