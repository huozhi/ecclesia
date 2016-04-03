'use strict'

const router = require('express').Router()
const logger = require('log4js').getLogger()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Discuss = require('../proxy').Discuss
const User = require('../proxy').User
const UserModel = require('../models').User
const Eventproxy = require('eventproxy')
const common = require('../common')


exports.index = function (req, res, next) {
  return res.render('home/home', {
    user: req.session.user
  })
}

exports.createRoom = function (req, res, next) {
  const room = req.body.room
  const topics = req.body.topics
  const host = req.session.user

  Discuss.create(room, host, topics)
  .then(function(newDisscuss) {
    // console.log('newDisscuss', newDisscuss)
    req.session.room = newDisscuss
    return User.update({_id: host._id}, {
      $push: { discusses: newDisscuss._id }
    }).exec()
  })
  .then(function(oks) {
    return res.send({
      next: '/chat',
    })
  })
  .catch(function(err) {
    return common.errors(re, 500, err)
  })
}

exports.joinRoom = function (req, res, next) {
  const query = {
    room: req.body.room,
    host: ObjectId(req.body.host._id), 
  }
  const user = req.session.user
  console.log('query', req.body, user)
  // find the newest discuss room created by the host
  let p = Discuss.findDiscussByQuery(
    query,
    { $sort: { date: -1 } }
  )

  logger.debug('p', p)

  p.then(function(discuss) {
    logger.debug('discuss', discuss)
    return Discuss.addParticipant(discuss, user)
  })
  .then(function(discusses) {
    logger.debug('updated', discusses)
    return res.send({
      next: '/chat',
    })
  })
  .catch(function(err) {
    logger.debug(err)
    return common.errors(res, 500, err)
  })
}
