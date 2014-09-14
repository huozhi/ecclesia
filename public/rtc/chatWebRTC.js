/*

WebRTC and Reveal.js initialized

*/

function enableWebRTC (mediaContrains) {

// var room = location.search && location.search.split('?')[1];
var room = $.cookie('roomName');

var webrtc = new SimpleWebRTC({
  // url: "http://localhost:8888",
  localVideoEl: 'local-video',
  remoteVideoEl: 'all-videos',
  media: mediaContrains || {
    video: true, audio: true
  },
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
  // $('#create-room-btn').click(function () {
    // use uuid to create room, pass null to first arg
  var roomHash = $.cookie('roomHash');
  
  webrtc.createRoom(roomHash, function (err, name) {
    var roomUrl = location.pathname + '?' + name;
    if (!err) {
      history.replaceState({ roomHash: $.cookie('roomHash') }, null, roomUrl);
    }
  });
  // })
} else {
  console.log('already in a room');
}



Reveal.initialize({
  width: 800,
  height: 400,
  margin: 0.5,
  minScale: 1.0,
  maxScale: 1.0,
  center: true,
  transition: 'liner',
  transitionSpeed: 'fast',
  backgroundTransition: 'slide',

  dependencies: [
    { src: 'js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: 'js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    // { src: 'js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/math/math.js', async: true }
    ]  
});

Reveal.addEventListener( 'ready', function( event ) {
  var present = $('section.present');
  if (present.children('canvas').length != 0) {
    console.log('has canvas')
    var curCanvas = $('.present > canvas');
    if (!curCanvas.hasClass('sketch-present')) {
      // console.log('no active class')
      curCanvas.addClass('sketch-present');
    }
  }
  else {
    present.append('<canvas class="sketch sketch-present" width="800" height="400"></canvas>');
  }

    $('.sketch-present').Stroke(function (point) {
      webrtc.sendSketchPointData(point);
    });

});

Reveal.addEventListener( 'slidechanged', function( event ) {
  $('.sketch-present').removeClass('sketch-present');
  var present = $('.slides > section.present');
  if (present.children('canvas').length != 0) {
    // console.log('has canvas')
    var curCanvas = $('.present > canvas');
    if (curCanvas.hasClass('sketch-present') == false) {
      // console.log('no active class')
      curCanvas.addClass('sketch-present');
    }
  }
  else {
    present.append('<canvas class="sketch sketch-present" width="800" height="400"></canvas>');
  }
    $('.sketch-present').Stroke(function (point) {
      webrtc.sendSketchPointData(point);
    });
});

}