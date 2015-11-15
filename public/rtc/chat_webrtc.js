'use strict';

var parseUrl = function(url) {
  var query = url || location.search
  var res = {}
  query.split('&').forEach(function (part) {
    var item = part.split('=')
    res[ item[0] ] = item[1]
  })
  return res
}

var RtcController = {
  host: null,
  room: null,
  webrtc: null,
  constraints: null,
}


RtcController.enableWebRTC = function() {

  var res = parseUrl(location.search.split('?')[1])
  var host = this.host = res['host']
  var room = this.room = res['room']
  var self = this.self = res['self']
  var discuss = null

  console.log('host', host, 'room', room, 'self', self)

  var webrtc = this.webrtc

  var port = 8888
  var rtcUrl = window.location.protocol + '//' + window.location.hostname + ':' + port
  webrtc = new SimpleWebRTC({
    url: rtcUrl,
    socketio: { 'force new connection':true },
    localVideoEl: 'localVideo',
    remoteVideosEl: 'remoteVideos',
    // userame: self,
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false,
    autoRemoveVideos: true,
  })


  webrtc.on('readyToCall', function() {
    if (room) {
      if (host == self) {
        var roomUrl
        webrtc.createRoom(room, function (err, name) {
          // name equal roomHash equal roomUrl splited by '?'
          if (err) {
            console.log(err)
          }
          console.log ('create room success', room)
        })
      }
      else {
        console.log('join room', room)
        webrtc.joinRoom(room)
      }
    }
  })


  // var remotes = $('#remoteVideos')

  webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer)
    var remotes = document.getElementById('remoteVideos')
    if (remotes) {
      var d = document.createElement('div');
      d.className = 'video-source videoContainer';
      d.id = 'container_' + webrtc.getDomId(peer);
      d.appendChild(video);
      var vol = document.createElement('div');
      vol.id = 'volume_' + peer.id;
      vol.className = 'volume_bar';
      // video.onclick = function () {
      //     video.style.width = video.videoWidth + 'px';
      //     video.style.height = video.videoHeight + 'px';
      // };
      d.appendChild(vol);
      remotes.appendChild(d);
    }
  })


  // function addVideoContainer(video, peer) {
  //   var peerCntr = $('<div/>')
  // }

  webrtc.on('videoRemoved', function (video, peer) {
    console.log('videoRemoved')
    var remote = document.getElementById('remoteVideos')
    var leavePeer = document.getElementById('container_' + webrtc.getDomId(peer))
    if (remote && leavePeer) {
      remote.removeChild(leavePeer)
    }
  })

  // webrtc.on('channelMessage', function (peer, label, data) {
  //   if (data.type == 'volume') {
  //     showVolume(document.getElementById('volume_' + peer.id), data.volume)
  //   }
  // })

  webrtc.on('volumeChange', function (volume, threshold) {
    var volBar = $('#localVolBar')
    if (volBar == []) return
    if (volume < -45) { // vary between -45 and -20
      volBar.css('height', '0px')
    }
    else if (volume > -20) {
      volBar.css('height', '100%')
    }
    else {
      volBar.css('height', '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%')
    }
  })

}

