'use strict'

const marked = require('marked')
const utils = require('./utils')
const MediaTool = require('./media-tool')
const chatWebRTC = require('./chat_webrtc')

const SYNC_INTERVAL = 1000 * 20
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
  slides: [
    DEFAULT_SLIDE_CONTENT
  ],
  init: function() {
    $.fn.carousel.Constructor.prototype.keydown = function(){};
    const query = utils.parseQuery()
    this.room = query.room
    this.host = query.host
    this.self = query.self

    this.slides.forEach((item, idx) => {
      this.append(idx, item)
    });

    $addSlide.click(() => {
      if ($editBoard.css('display') !== 'block') {
        this.slides.push('# new')
        const lastIndex = this.slides.length - 1
        this.append(lastIndex, this.slides[lastIndex])
      }
    })

    this._syncInterval = setInterval(() => this.sync(), SYNC_INTERVAL)
  },
  sync: function() {
    $.post('/chat/sync', {
      slides: this.slides,
      discussId: this.room,
    }).fail(() => clearInterval(this._syncInterval))
  },
  render: function(pageId) {
    const slide = this.slides[pageId]
    const $slide = $('[data-id=' + pageId + ']')
    $slide.children('.slide-content').html(marked(slide))
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
      const $slideItem = $('<div/>', {
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
  edit: function() {
    const shown = $editBoard.css('display')
    const $li = $slidesNav.children().filter('.active')
    const pageId = $li.data('slide-to')
    if (shown === 'none') {
      $slides.hide()
      $editBoard.show()
      // assign text
      const slide = this.slides[pageId]
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
  $slideEdit.click(Impress.edit.bind(Impress))
  $mediaOptions.click(MediaTool.check.bind(MediaTool))
}

function initChatPage() {
  chatWebRTC.enableWebRTC()
  Impress.init()
  Discuss.init()
}

module.exports = initChatPage
