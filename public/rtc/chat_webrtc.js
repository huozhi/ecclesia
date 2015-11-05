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

  var port = 3000
  var rtcUrl = window.location.protocol + '//' + window.location.hostname + ':' + port
  webrtc = new SimpleWebRTC({
    url: rtcUrl,
    localVideoEl: 'localVideo',
    remoteVideosEl: 'remoteVideos',
    userame: self,
    media: this.constraints || {
      video: true, audio: true
    }, // need to be rewriten
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
  })


  webrtc.on('readyToCall', function() {
    if (discuss || host !== self) {
      webrtc.joinRoom(room)
    }
  })

  var remotes = $('#remoteVideos')

  webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer)
    addVideoContainer(video, peer)
  })


  function addVideoContainer(video, peer) {
    var peer = $('<div/>')
    var volBar  = $('<div/>')
    volBar.addClass('vol-var')
    peer.append(volBar)
    peer.addClass('video-source')
    peer.attr('id', 'video_' + webrtc.getDomId(peer))
    peer.append(video)
    remotes.append(peer)
  }

  webrtc.on('videoRemoved', function (video, peer) {
    console.log('videoRemoved')
    var leavePeer = $('#video_' + webrtc.getDomId(peer))
    if (remotes && leavePeer) {
      leavePeer.remove()
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


  if (!discuss && host === self) {
    console.log(host, 'create room now')
    var roomUrl
    webrtc.createRoom(room, function (err, name) {
      // name equal roomHash equal roomUrl splited by '?'
      if (err) {
        console.error(err)
      } else {
        roomUrl = location.pathname + '?' + room
        // history.replaceState({ room: room }, null, roomUrl)
      }
    })
  }
  // else {
    // console.log('join room')
    // roomUrl = location.pathname + '?' + room
    // history.replaceState({ room: room }, null, roomUrl)
  // }
}

