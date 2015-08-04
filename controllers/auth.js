'use strict'

var express = require('express')

var crypto = require('crypto')
var Render = require('../common/').Render
var User = require('../proxy').User
var UserModel = require('../models').User
var Eventproxy = require('eventproxy')
var authMiddleware = require('../middlewares/auth')

exports.index = function (req, res, next) {
  return Render(req, res, 'index', 'auth/reg', {
    user_form: 'auth/reg.html'
  })
}

exports.registerAction = function (req, res, next) {
  console.log('registerAction', req.body)
  var username = req.body.username
  var password = req.body.password
  var passrept = req.body.passrept
  var email    = req.body.email

  if (passrept !== password) {
    console.log('password repeate not matched')
    return index(req, res, next)
  }
  User.register(username, password, email, function (err, newuser) {
    if(err) {
      res.status(500)
      return res.json({ status: "internal server error" })
    }
    var user = {
      username: username,
      password: password,
      email: email
    }
    req.session.user = UserModel(user)
    return res.json({ status: "ok", username: username })
  })
}

exports.loginView = function (req, res, next) {
  return Render(req, res, 'index', 'auth/login', {
    user_form: 'auth/login.html'
  })
}

exports.loginAction = function (req, res, next) {
  console.log('recieve', req.get('Content-Type'))
  console.log('body', req.body)
  var username = req.body.username
  var password = req.body.password
  
  var findUserMethod
  if (username.indexOf('@') !== -1) {
    findUserMethod = User.findUserByMail
  }
  else {
    findUserMethod = User.findUserByName
  }

  var ep = new Eventproxy()
  ep.fail(next)
  ep.on('login_error', function (message) {
    res.json({ status: "ok", message: message })
  })

  User.findUserByName(username, function (err, user) {
    if (err) {
      console.log(err)
      return next(err)
    }
    if (user && user.username === username && user.password === password) {
      authMiddleware.genSession(res, user)
      req.session.user = user
      console.log('login', req.session.user)
      console.log('authToken', req.cookies.authToken)
      res.json({ status: "ok" })
    }
    else {
      ep.emit('login_error', 'dont know')
    }  
  })
}
