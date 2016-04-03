var express = require('express')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId
var Discuss = require('../proxy').Discuss
var User = require('../proxy').User
var UserModel = require('../models').User
var Eventproxy = require('eventproxy')
var Eventproxy = require('eventproxy')
var common = require('../common')

var router = express.Router()


exports.index = function (req, res, next) {
  var ep = new Eventproxy()
  ep.on('success', function (user) {
    return res.render('home/home', {
      user: user
    })
  })
  ep.on('error', function(err) {
    return common.errors[500](res, err)
  })

  if (req.session.user) {
    ep.emit('success', req.session.user)
  } else {
    var _token = req.cookies['c_u']
    UserModel.findById(_token).exec()
    .then(function(user) {
      req.session.user = user
      ep.emit('success', req.session.user)
    })
    .catch(function(err) {
      ep.emit('error', err)
    })
  }
}

exports.createRoom = function (req, res, next) {
  var room, host, topics, message
  room = req.body.room
  topics = req.body.topics
  message = null
  host = req.session.user

  return Discuss.create(room, host, topics, function (err, newDisscuss) {
    if (err) {
      // console.log('create failed\n%s', err)
      return common.errors[500](res, err)
    }
    User.update({_id: host}, { $push: { discusses: newDisscuss._id } }).exec()
    .then(function(user) {
      // console.log(user.discusses)
      message = 'create new discuss success'
      return res.send(common.successResult(message))
    })
    .catch(function(err) {
      return common.errors[500](res, err)
    })
  })
}

exports.joinRoom = function (req, res, next) {
  var ep = new Eventproxy()
  ep.on('err', function(err) {
    return common.errors[500](res, err)
  })

  var discussQuery = {
    room: req.body.room,
    host: req.body.host,
  }
  // console.log('joinRoom:', discussQuery)

  // find the newest discuss room created by the host
  return Discuss.findDiscussByQuery(
    discussQuery,
    { $sort: { 'date': -1 } },
    function (err, discuss) {
    if (err) {
      return ep.emit('err', err)
    }
    var userId = req.session.user._id
    User.findById(userId, function (err, user) {
      if (err) {
        console.log('find user failed\n%s', err)
        return ep.emit('err', err)
      }
      Discuss.addParticipant(discuss, user, function (err, users) {
        if (err) {
          return ep.emit('err', err)
        }
        return res.send(common.successResult())
      })
    })
  })
}
