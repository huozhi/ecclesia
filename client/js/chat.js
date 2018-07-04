'use strict'

const marked = require('marked')
const utils = require('./utils')
const MediaTool = require('./media-tool')
const ChatRTCService = require('./rtc-service')

const DEFAULT_SLIDE_CONTENT = '# Welcome to Ecclesia\nedit your slides here... '

/**
 * data structure will used defination
 * Discuss, Impress
 */
var $slides = $('#slides')
var $addSlide = $('#addSlide')
var $carousel = $('#impress')
var $slidesNav = $('#impress ol')
var $editBoard = $('#editBoard')
var $slideEdit = $('#slideEdit')
var $mediaOptions = $('#mediaOpts')
var $slideContent = $('#slideContent')

var Impress = {
  slide: DEFAULT_SLIDE_CONTENT,
  init: function() {
    const query = utils.parseQuery()
    this.room = query.room
    this.host = query.host
    this.render()

    $slideEdit.click(() => Impress.edit())
  },
  
  render: function() {
    $('.impress-panel').html(marked(this.slide))
  },
  edit: function() {
    const shown = $editBoard.css('display')
    
    if (shown === 'none') {
      $slides.hide()
      $editBoard.show()

      $slideContent.val(this.slide)
    }
    else {
      $slides.show()
      $editBoard.hide()

      this.slide = $slideContent.val()
      this.render()
    }
  }
}

var Discuss = function(room, host, date, participants, topics) {
  this.room = room
  this.host = host
  this.date = date || new Date()
  this.participants = participants || []
  this.topics = topics || []
}

const renderMediaReady = () => {
  MediaTool.check().then(mediaready => {
    createOptionList(mediaready, 'video')
    createOptionList(mediaready, 'audio')
  })

  function createOptionList(mediaready, type) {
    const options = mediaready[type + 'List'].map(camera => {
      const opt = document.createElement('input')
      opt.setAttribute('type', 'radio')
      opt.setAttribute('value', camera.id)
      opt.checked = camera.id === mediaready[type + 'Source']
      const label = document.createElement('label')
      label.textContent = camera.label
      label.style.marginLeft = '10px'
      
      return [opt, label]
    })
    
    const menu = document.querySelector('.' + type + '-menu')
    utils.removeChildren(menu)

    options.forEach(pair => {
      const li = document.createElement('li')
      li.appendChild(pair[0])
      li.appendChild(pair[1])
      menu.appendChild(li)
    })
  }
}

Discuss.init = function() {
  $mediaOptions.click(renderMediaReady)
}

function initChatPage() {
  ChatRTCService.enableWebRTC()
  Impress.init()
  Discuss.init()
}

module.exports = initChatPage
