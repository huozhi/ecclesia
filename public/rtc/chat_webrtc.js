'use strict'

var RtcController = function () { }

RtcController.parseUrl = function(url) {
  var query = url || location.search
  var res = {}
  query.split('&').forEach(function (part) {
    var item = part.split('=')
    res[ item[0] ] = item[1]
  })
  return res
}

RtcController.enableWebRTC = function() {

  // var host, room, self
  // var room = location.search && location.search.split('?')[1]
  // var room = sessionStorage.getItem('room') || 'test'
  var res = parseUrl(location.search.split('?')[1])
  window.host = res['host']
  window.room = res['room']
  window.self = res['self']
  // var roomHash = sessionStorage.getItem('roomHash')
    
  // console.log('roomName:',room)
  // console.log('roomHash:',roomHash)
  // console.log('host',sessionStorage.getItem('creator'))


  var uname = $('#userName').text()
  var port = 3000
  var rtcUrl = window.location.protocol + '//' + window.location.hostname + ':' + port
  // console.log(rtcUrl)
  window.webrtc = new SimpleWebRTC({
    url: rtcUrl,
    localVideoEl: 'localVideo',
    remoteVideoEl: 'allVideos',
    username: uname,
    media: window.constraints || {
      video: true, audio: true
    }, // need to be rewriten
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false
  })


  webrtc.on('readyToCall', function() {
    if (room) {
      webrtc.joinRoom(room)
      // console.log('join room')
    }
  })



  webrtc.on('videoAdded', function (video, peer) {
    console.log(peer)
    addVideoContainer(video, peer)
    addPreviewContainer(peer)
  })

  function addPreviewContainer(peer) {
    var remotes = $('.right-sidebar')
    var peer = $(document.createElement('div')).addClass('container-frame')
    peer.attr('id', 'preview_' + webrtc.getUserName(peer))
    remotes.append(peer)
  }

  function addVideoContainer(video, peer) {
    var remotes = $('.left-sidebar')
    var peer = $(document.createElement('div'))
    var volBar  = $(document.createElement('div'))
    volBar.addClass('vol-var')
    peer.append(volBar)
    peer.addClass('container-frame')
    peer.attr('id', 'video_' + webrtc.getUserName(peer))
    peer.append(video)
    remotes.append(peer)
  }

  webrtc.on('videoRemoved', function (video, peer) {
    var remotes = $('.left-sidebar')
    var leavePreview = $('#preview_' + webrtc.getUserName(peer))
    var leavePeer = $('#video_' + webrtc.getUserName(peer))
    if (remotes && leavePeer) {
      leavePeer.remove()
      leavePreview.remove()
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


  if (host === self) {
    console.log('get err, create room now')
    var roomUrl
    webrtc.createRoom(room, function (err, name) {
      // name equal roomHash equal roomUrl splited by '?'
      roomUrl = location.pathname + '?' + room
      if (!err) {
        // history.replaceState({ room: room }, null, roomUrl)
      }
    })
  }
  else {
    console.log('join room')
    roomUrl = location.pathname + '?' + room
    // history.replaceState({ room: room }, null, roomUrl)
  }

  /* ============= new event ============== */
  webrtc.on('rtcSyncStroke', function (point) {
    $('.sketch-present').syncStroke(point)
  })

  function getOutlineFoucs(recvOutlineText) {
    console.log('getOutlineFoucs')
    $('.list-group').children().each(function() {
      if ($(this).text() == recvOutlineText) {
        console.log($(this), $(this).text())
        $(".list-group").children("li").css("background-color","#fff")
        $(".list-group").children("li").css("color","#000")
        $(this).css("background-color","#a8a8a8")
        $(this).css("color","#fff")
      }
    })
  }

  webrtc.on('rtcSyncOutlineText', function (outlineText) {
    console.log('rtcSyncOutlineText')
    getOutlineFoucs(outlineText)
  })

  webrtc.on('rtcSyncChart', function (chartData) {

    console.log('webrtc.on rtcSyncChart')
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
        
        var base64code = lzw_uncompress(data.image.img)
        // console.log(base64code)
        var $singleChart = $(document.createElement('div'))
                          .addClass('single-chart')
                          .append('<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>')
        var addContent =
        '<div class="single-chart">' +
          '<canvas class="chart" width="180" height="180"></canvas>' +
          '<button class="btn btn-default btn-xs rm-chart"><span class="glyphicon glyphicon-remove"></span></button>' +
        '</div>'
        var $createCanvas = $(document.createElement('canvas'))
                      .addClass('chart').attr({width:"180",height:"180"})
        var chartContext = $createCanvas.get(0).getContext('2d')
        var canvasImg = new Image()
        canvasImg.src = base64code
        canvasImg.onload = function() {
          chartContext.drawImage(canvasImg, 0, 0)
          $singleChart.prepend($createCanvas)
          $('#charts').append($singleChart)
        }
        $('.rm-chart').click(function() {
          $(this).parent().remove()
        })

      },
      error: function (err) { alert(err) }
    })
  })

  webrtc.on('rtcSyncImpress', function (impressData) {
    console.log('client sync impress')
    impressData.forEach(function(markdown, index) {
      var $section = $('<section data-markdown></section>')
      var $mdScript = $('<script />', {
        html: markdown,
        type: 'text/template'
      })
      $section.append($mdScript)
      $('.slides').append($section)
    })
    // RevealMarkdown.reinit()
    // Reveal.next()
    // Reveal.prev()
  })

  webrtc.on('rtcSyncPreview', function (previewData) {
    console.log('recv from', previewData.username)
    var previewCntrId = '#preview_' + previewData.username
    console.log($(previewCntrId))
    $(previewCntrId).children().remove()
    var $section = $('<section data-markdown></section>')
    console.log('md',previewData.preview)
    $section.append(
        $('<script />', {
          html: previewData.preview,
          type: 'text/template'
        })
      )
    $(previewCntrId).append($section)
    // RevealMarkdown.reinit()
  })
  
}

