var Synchronize = {

}

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

    MediaStreamTrack.getSources(function (sourceInfos) {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio') {
          audioList.push({id: sourceInfo.id, label: sourceInfo.label || 'microphone-' + i});
          // console.log(sourceInfo.id, sourceInfo.label || 'm');
        } else if (sourceInfo.kind === 'video') {
          cameraList.push({id: sourceInfo.id, label: sourceInfo.label || 'camera-' + i});
          // console.log(sourceInfo.id, sourceInfo.label || 'c');
        } else {
          // console.log('other type media');
        }
        if (audioList.length) {
          mr.audioSource = audioList[0].id;
          $(this).data('audioSource', audioList[0].id);
          mr.micReady = true;
          $('#select-audio').text(audioList[0].label).append('<span class="caret cert-right"></span>');
        }
        if (cameraList.length) {
          mr.videoSource = cameraList[0].id;
          $(this).data('videoSource', cameraList[0].id);
          mr.camReady = true;
          $('#select-camera').text(cameraList[0].label).append('<span class="caret cert-right"></span>');
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
        $('#select-audio').text($(this).text()).append('<span class="caret cert-right"></span>');
      });

      $('a.camera-item').click(function() {
        mr.videoSource = $(this).prev().text();
        $(this).data('videoSource', $(this).prev().text());
        $('#select-camera').text($(this).text()).append('<span class="caret cert-right"></span>');
      });

      $('.media-check-close').click(function() {
        audioMenu.children().remove();
        cameraMenu.children().remove();
        // window.location.href = "/chat";
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

$(document).ready(function() {
  $.cookie('sketchChanged', false);


});


