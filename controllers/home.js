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

const getChatParams = function(room, hostId, userId) {
  const params = {
    room: room,
    host: hostId,
    self: userId,
  }
  const arr = []
  Object.keys(params).forEach(function(key) {
    arr.push(`${key}=${params[key]}`)
  })
  return arr.join('&')
}

exports.index = function (req, res, next) {
  if (req.session.user) {
    res.render('home/home', {
      user: req.session.user
    })
  } else {
    res.redirect('/')
  }
}

exports.createRoom = function (req, res, next) {
  const room = req.body.room
  const topics = req.body.topics
  const host = req.session.user

  Discuss.create(room, host, topics)
  .then(function(newDisscuss) {
    logger.debug('new disscuss', newDisscuss)
    req.session.room = newDisscuss
    req.session.host = host._id
    return User.update({_id: host._id}, {
      $push: { discusses: newDisscuss._id }
    }).exec()
  })
  .then(function(oks) {
    const params = getChatParams(room, host._id, host._id)
    logger.debug('create room', `/chat?${params}`)
    return res.send({
      next: `/chat?${params}`,
    })
  })
  .catch(function(err) {
    logger.error('home.createRoom', err)
    return common.errors(re, 500, err)
  })
}

exports.joinRoom = function (req, res, next) {
  const room = req.body.room
  const host = req.body.host // type:string, user name
  const user = req.session.user
  let hostId

  logger.debug('joinRoom req.body', req.body)
  User.findByName(host)
  .then(function(hostUser) {
    hostId = hostUser._id
    const query = {
      room: room,
      host: ObjectId(hostId),
    }
    logger.debug('home.joinRoom Discuss.findDiscussByQuery', query)
    return Discuss.findDiscussByQuery(query, { $sort: { date: -1 } })
  })
  .then(function(discuss) {
    logger.debug('session.user', user.name)
    logger.debug('home.joinRoom Discuss.addParticipant', discuss, user.name)
    return Discuss.addParticipant(discuss, user)
  })
  .then(function(numAffected) {
    logger.debug('home.joinRoom, updated', numAffected)
    req.session.room = room
    req.session.host = hostId
    const params = getChatParams(room, hostId, user._id)
    logger.debug('join room', `/chat?${params}`)
    return res.send({
      next: `/chat?${params}`,
    })
  })
  .catch(function(err) {
    logger.debug(err)
    return common.errors(res, 500, err)
  })
}
