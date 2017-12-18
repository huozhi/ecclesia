'use strict'

var MediaTool = {
  Ready: function(asrc, vsrc, mready, cready) {
    this.audioSource = asrc   || null,
    this.videoSource = vsrc   || null;
    this.micReady    = mready || false,
    this.camReady    = cready || false;
  },

  check: function(callback) {
    var mr = new MediaTool.Ready(),
        audioList  = [],
        cameraList = [];

    window.navigator.mediaDevices.enumerateDevices().then((sourceInfos) => {
      for (let i = 0; i < sourceInfos.length; i++) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audioinput') {
          audioList.push({id: sourceInfo.id, label: sourceInfo.label || 'microphone-' + i});
        } else if (sourceInfo.kind === 'videoinput') {
          cameraList.push({id: sourceInfo.id, label: sourceInfo.label || 'camera-' + i});
        } else {
        }
        if (audioList.length) {
          mr.audioSource = audioList[0].id;
          $(this).data('audioSource', audioList[0].id);
          mr.micReady = true;
          $('#select-audio').text(audioList[0].label)
        }
        if (cameraList.length) {
          mr.videoSource = cameraList[0].id;
          $(this).data('videoSource', cameraList[0].id);
          mr.camReady = true;
          $('#select-camera').text(cameraList[0].label)
        }
      }
      var cameraMenu = $('.camera-menu');
      cameraList.forEach(function (ele, index) {
        var cameraChoice = '<li role="presentation"><p class="camera-device-id sr-only">' +
        ele.id + '</p><a class="camera-item" role="menuitem" tabindex="-1">' + ele.label + '</a></li>';
        cameraMenu.append(cameraChoice);
      });

      var audioMenu = $('.audio-menu');
      audioList.forEach(function (ele) {
        var audioChoice = '<li role="presentation">' + '<p class="audio-device-id sr-only">' +
        ele.id + '</p><a class="audio-item" role="menuitem" tabindex="-1">' + ele.label + '</a></li>';
        audioMenu.append(audioChoice);
      });
      
      $('a.audio-item').click(function() {
        mr.audioSource = $(this).prev().text();
        $(this).data('audioSource', $(this).prev().text());
        $('#select-audio').text($(this).text())
      });

      $('a.camera-item').click(function() {
        mr.videoSource = $(this).prev().text();
        $(this).data('videoSource', $(this).prev().text());
        $('#select-camera').text($(this).text())
      });

      $('.media-check-close').click(function() {
        audioMenu.children().remove();
        cameraMenu.children().remove();
      });

      window.constraints = {
        audio: {
          optional: [{sourceId: $(this).data('audioSource')}]
        },
        video: {
          optional: [{sourceId: $(this).data('videoSource')}]
        }
      };
      if (callback) return callback(window.constraints);
    });
  }
}

module.exports = MediaTool
