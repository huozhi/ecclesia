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
  console.log('home', req.session.user)
  var ep = new Eventproxy()
  ep.on('success', function (user) {
    return res.render('home/home', {
      user: user
    })
  })
  ep.on('err', function(err) {
    return common.erros[500](res, err)
  })

  var authToken, user
  if (!req.session.user) {
    authToken = req.cookies.authToken
    // console.log('reload authToken', typeof authToken, authToken)
    if (authToken) {
      UserModel.findById(authToken, function (err, user) {
        // console.log('query user', user)
        if (err) { return ep.emit('err', err) }
        req.session.user = user
        if (req.session.user) {
          // console.log 
          ep.emit('success', req.session.user)
        } else {
          return next()
        }
      })
    }
  }
  else {
    ep.emit('success', req.session.user)
  }
}

exports.logout = function (req, res, next) {  
  req.session.destroy(function (err) {
    res.redirect('/')
  })
}

exports.createRoom = function (req, res, next) {
  var room, host, topics, message
  room = req.body.room
  topics = req.body.topics
  message = null
  host = req.session.user._id

  return Discuss.create(room, host, topics, function (err, newDisscuss) {
    if (err) {
      console.log('create failed\n%s', err)
      return common.erros[500](res, err)
    }
    message = 'create new discuss success'
    return res.send(common.successResult(message))
  })
}

exports.joinRoom = function (req, res, next) {
  var discussQuery = {
    room: req.body.room,
    host: req.body.host,
  }
  console.log('joinRoom:', discussQuery)
  // find the newest discuss room created by the host
  var ep = new Eventproxy()
  ep.on('err', function(err) {
    return common.errors[500](res, err)
  })
  

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

