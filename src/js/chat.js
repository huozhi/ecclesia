'use strict'

const utils = require('./utils')
const MediaTool = require('./media-tool')
const RtcController = require('./chat_webrtc')

const SYNC_INTERVAL = 1000 * 20

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

/******* SLIDES *******/
var Impress = {
  slides: [
    '# Welcome to Ecclesia\nyou could edit your slides here... '
  ],
  init: function() {
    $.fn.carousel.Constructor.prototype.keydown = function(){};

    this.slides.forEach((item, idx) => {
      this.append(idx, item)
    });

    var query = utils.parseQuery()
    this.room = query.room
    this.host = query.host
    this.self = query.self

    $addSlide.click(() => {
      if ($editBoard.css('display') !== 'block') {
        this.slides.push('# new')
        const lastIndex = this.slides.length - 1
        this.append(lastIndex, this.slides[lastIndex])
      }
    })
    this.renderAll()

    setInterval(() => this.sync(), SYNC_INTERVAL)
  },
  sync: function() {
    const slides = this.slides

    $.post('/chat/sync', {
      slides: slides,
      discussId: this.room,
    })
  },
  render: function(pageId) {
    var $slide = $('div[data-id=' + pageId + ']')
    var slide = this.slides[pageId]
    $slide.children('.slide-content').html(
      marked(slide)
    )
  },
  renderAll: function() {
    var $mark = $('.slide-content')
    $mark.each(function (index, ele) {
      var $this = $(ele)
      var text = marked($this.text())
      $this.html(text)
    })
  },
  append: function(idx, slide) {
      // add navigator
      $('<li/>', {
        class: idx === 0 ? 'active' : ''
      })
      .attr('data-target', '#impress')
      .attr('data-slide-to', idx)
      .appendTo($slidesNav)

      // add content
      var $slideItem = $('<div/>', {
        class: idx === 0 ? 'item active' : 'item'
      })
      .attr('data-id', idx)
      .appendTo($slides)

      $('<div />', {
        class: 'text-center center-block slide-content'
      })
      .html(marked(slide))
      .appendTo($slideItem)

      // marked and navigate to it
      this.render(idx)
      this.sync()
      $carousel.carousel(idx)
  },
  edit: function(pageId) {
    var shown, pageId, $li
    shown = $editBoard.css('display')
    $li = $slidesNav.children().filter('.active')
    pageId = $li.data('slide-to')
    if (shown === 'none') {
      $slides.hide()
      $editBoard.show()
      // assign text
      var slide = this.slides[pageId]
      $slideContent.val(slide)
    }
    else {
      $slides.show()
      $editBoard.hide()

      this.slides[pageId] = $slideContent.val()
      this.render(pageId)
      this.sync()
    }
  }
}

/******* SLIDES *******/


/******* DISCUSS *******/

var Discuss = function(room, host, date, participants, topics) {
  this.room = room
  this.host = host
  this.date = date || new Date()
  this.participants = participants || []
  this.topics = topics || []
}

Discuss.info = function () {
  return {
    room: this.room,
    date: this.date,
    host: this.host
  }
}

Discuss.init = function() {
  $slideEdit.click(Impress.edit)
  $mediaOptions.click(MediaTool.check)
}
/******* DISCUSS *******/

function ChatPageController() {
  RtcController.enableWebRTC()
  Impress.init()
  Discuss.init()
}

window.addEventListener('load', ChatPageController)
