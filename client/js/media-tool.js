import { resolve } from "url";

'use strict'

const MediaReady = function(asrc, vsrc, mready, cready) {
  this.audioSource = asrc   || null,
  this.videoSource = vsrc   || null;
  this.micReady    = mready || false,
  this.camReady    = cready || false;
}

const MediaTool = {
  check: function() {
    const mr = new MediaReady(),
        audioList  = [],
        videoList = [];

    const promise = window.navigator.mediaDevices.enumerateDevices()

    return promise.then((mediaDeviceInfos) => {
      const sources = 
        mediaDeviceInfos.filter(
          (mdi, index, arr) => arr.findIndex(a => a.groupId === mdi.groupId) === index
        )
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (source.kind === 'audioinput') {
          audioList.push({id: source.groupId, label: source.label || 'microphone-' + i});
        } else if (source.kind === 'videoinput') {
          videoList.push({id: source.groupId, label: source.label || 'camera-' + i});
        }

        if (audioList.length) {
          mr.audioSource = audioList[0].id;
          mr.micReady = true;
        }
        if (videoList.length) {
          mr.videoSource = videoList[0].id;
          mr.camReady = true;
        }
      }
      mr.videoList = videoList
      mr.audioList = audioList

      return mr
    })
  }
}

module.exports = MediaTool
