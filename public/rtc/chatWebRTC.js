/*

WebRTC and Reveal.js initialized

*/

function enableWebRTC (mediaContrains) {

var room = location.search && location.search.split('?')[1];
// var room = $.cookie('roomName');

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
  addVideoContainer(video, peer);
  addPreviewContainer(peer);
});

function addPreviewContainer(peer) {
  var remotes = $('.right-sidebar');
  var addPeer = $(document.createElement('div')).addClass('container-frame');
  addPeer.attr('id', 'preview_' + webrtc.getDomId(peer));
  remotes.append(addPeer);
}

function addVideoContainer(video, peer) {
  var remotes = $('.left-sidebar');
  var addPeer = $(document.createElement('div'));
  var volBar  = $(document.createElement('div'));
  volBar.addClass('vol-var');
  addPeer.append(volBar);
  addPeer.addClass('container-frame');
  addPeer.attr('id', 'video_' + webrtc.getDomId(peer));
  addPeer.append(video);
  remotes.append(addPeer);
}

webrtc.on('videoRemoved', function (video, peer) {
  var remotes = $('.left-sidebar');
  var leavePeer = $('#video_' + webrtc.getDomId(peer));
  if (remotes && leavePeer) {
    leavePeer.fadeOut().remove();
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


/* ============= new event ============== */
webrtc.on('rtcSyncStroke', function (point) {
  $('.sketch-present').syncStroke(point);
});

webrtc.on('rtcSyncChart', function (chartData) {
  // console.log('webrtc.on rtcSyncChart');
  $.ajax({
    url: '/chat/query-img',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      request: 'get-chart',
      objectId: chartData.objectId
    }),
    success: function (data) {
      
      var base64code = lzw_uncompress(data.image.img);
      // console.log(base64code);
      var $singleChart = $(document.createElement('div'))
                        .addClass('single-chart')
                        .append('<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>');
      var addContent =
      '<div class="single-chart">' +
        '<canvas class="chart" width="180" height="180"></canvas>' +
        '<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>' +
      '</div>';
      var $createCanvas = $(document.createElement('canvas'))
                    .addClass('chart').attr({width:"180",height:"180"});
      var chartContext = $createCanvas.get(0).getContext('2d');
      var canvasImg = new Image();
      canvasImg.src = base64code;
      canvasImg.onload = function() {
        chartContext.drawImage(canvasImg, 0, 0);
        $singleChart.prepend($createCanvas);
        $('#charts').append($singleChart);
      };
      $('.rm-chart').click(function() {
        $(this).parent().remove();
      });

    },
    error: function (err) { alert(err); }
  });
});

webrtc.on('rtcSyncImpress', function (impressData) {
  $.ajax({
    url: '/chat/query-markdown',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      request: 'get-markdown',
      objectId: impressData.objectId
    }),
    success: function (data) {
      // the server return value and 
      // database structure should be fixed
      var $mdScript = $("<script />", {
        html: splitedMdArr,
        type: "text/template"
      });
      var $text = $('<section data-markdown></section>').append($mdScript);
      // console.log($impressText);
      $('#reveal > .slides').append($text);
      while (!Reveal.isLastSlide()) Reveal.next();
      RevealMarkdown.reinit();
    },
    error: function (err) { alert(err); }
  })
});

/* ============= end new event ============== */

if (!room) {
  // $('#create-room-btn').click(function () {
    // use uuid to create room, pass null to first arg
  var roomHash = $.cookie('roomHash') || 'hash123';
  
  webrtc.createRoom(roomHash, function (err, name) {
    var roomUrl = location.pathname + '?' + name;
    if (!err) {
      history.replaceState({ roomHash: $.cookie('roomHash') }, null, roomUrl);
    }
  });
  // })
} else {
  // console.log('already in a room');
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
    { src: '/js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: '/js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '/js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '/js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    // { src: 'js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } },
    // { src: 'js/plugin/math/math.js', async: true }
    ]  
});

Reveal.addEventListener('ready', function (event) {
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

Reveal.addEventListener('slidechanged', function (event) {
  // dynamically manage sketch borad class
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

    // if is the last one, save the previous one
    var $prevSlide  = $(Reveal.getPreviousSlide()),
        $prevSkect  = $prevSlide.find('canvas');
        
    saveImage($prevSkect, 'sketch', Reveal.getIndices().h);
});

// load chartInit.js script
enableChartPreview(webrtc);

}