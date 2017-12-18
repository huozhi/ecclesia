'use strict'

const utils = require('./utils')

var RtcController = {
  host: null,
  room: null,
  webrtc: null,
  constraints: null,
}


RtcController.enableWebRTC = function() {
  var res = utils.parseQuery(location.search.split('?')[1])
  var host = this.host = res['host']
  var room = this.room = res['room']
  var self = this.self = res['self']
  var discuss = null

  var webrtc = this.webrtc

  var port = 8888
  var rtcUrl = window.location.protocol + '//' + window.location.hostname + ':' + port
  webrtc = new SimpleWebRTC({
    url: rtcUrl,
    socketio: { 'force new connection':true },
    localVideoEl: 'localVideo',
    remoteVideosEl: '',
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
          if (err) {
            // already created on socket server, join directly
            console.error(err)
            webrtc.joinRoom(room)
          }
          else {
            console.log('create room success', room)
          }
        })
      }
      else {
        console.log('join room', room)
        webrtc.joinRoom(room)
      }
    }
  })



  webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer)
    var remotes = document.getElementById('remotes')
    if (remotes) {
      var d = document.createElement('div');
      d.className = 'video-source videoContainer';
      d.id = 'container_' + webrtc.getDomId(peer);
      d.appendChild(video);
      var vol = document.createElement('div');
      vol.id = 'volume_' + peer.id;
      vol.className = 'volume_bar';

      d.appendChild(vol);
      remotes.appendChild(d);
    }
  })


  webrtc.on('videoRemoved', function (video, peer) {
    console.log('videoRemoved')
    var remotes = document.getElementById('remotes')
    var leavePeer = document.getElementById('container_' + webrtc.getDomId(peer))
    if (remotes && leavePeer) {
      remotes.removeChild(leavePeer)
    }
  })

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

module.exports = RtcController
