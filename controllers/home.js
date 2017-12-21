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
    room,
    host: hostId,
    self: userId,
  }
  const arr = []
  Object.keys(params).forEach(function(key) {
    arr.push(`${key}=${params[key]}`)
  })
  return arr.join('&')
}

exports.createRoom = function (req, res, next) {
  const {room, topics} = req.body
  const host = req.session.user

  Discuss.create(room, host, topics)
  .then(function(newDisscuss) {
    logger.debug('new disscuss', newDisscuss)
    req.session.room = newDisscuss
    req.session.host = host._id
    return User.update({_id: host._id}, {
      $push: { discusses: newDisscuss._id }
    })
      .exec()
      .then(() => newDisscuss)
  })
  .then(function(discuss) {
    const params = getChatParams(discuss._id, host._id, host._id)
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
  const {room, host} = req.body
  const {user} = req.session
  let hostId

  logger.debug('joinRoom req.body', req.body)
  User.findByName(host)
  .then(function(hostUser) {
    hostId = hostUser._id
    const query = {
      room: room,
      host: ObjectId(hostId),
    }
    return Discuss
      .findOne(query)
      .sort({date: -1})
      .exec()
  })
  .then(function(discuss) {
    logger.debug('home.joinRoom Discuss.addParticipant', discuss, user.account)
    return Discuss.addParticipant(discuss, user).then(() => discuss)
  })
  .then(function(discuss) {
    req.session.room = discuss._id
    req.session.host = hostId
    const params = getChatParams(discuss._id, hostId, user._id)
    return res.send({
      next: `/chat?${params}`,
    })
  })
  .catch(function(err) {
    logger.error('joinRoom', err)
    return common.errors(res, 500, err)
  })
}
