'use strict'

var express = require('express')

var crypto = require('crypto')
var common = require('../common')
var User = require('../proxy').User
var UserModel = require('../models').User
var Eventproxy = require('eventproxy')
var middlewares = require('../middlewares')

exports.index = function (req, res, next) {
  return common.renderPjax(req, res, 'index', 'auth/reg', {
    user_form: 'auth/reg.html'
  })
}

exports.registerAction = function (req, res, next) {
  console.log('registerAction', req.body)
  var name = req.body.name
  var password = req.body.password
  var passrept = req.body.passrept
  var email    = req.body.email

  if (passrept !== password) {
    // console.log('password repeate not matched')
    // return index(req, res, next)
    return common.errors[400](res, 'password not matched in repeating')
  }
  User.register(name, password, email, function (err, newuser) {
    if(err) {
      return common.errors[500](res, err)
    }
    var user = {
      name: name,
      password: password,
      email: email
    }
    req.session.user = UserModel(user)
    return res.send(common.successResult())
  })
}

exports.loginView = function (req, res, next) {
  return common.renderPjax(req, res, 'index', 'auth/login', {
    user_form: 'auth/login.html'
  })
}

exports.loginAction = function (req, res, next) {
  console.log('recieve', req.get('Content-Type'))
  console.log('body', req.body)
  var name = req.body.name
  var password = req.body.password
  
  var findUserMethod
  if (name.indexOf('@') !== -1) {
    findUserMethod = User.findUserByMail
  }
  else {
    findUserMethod = User.findUserByName
  }

  var ep = new Eventproxy()
  ep.fail(next)
  ep.on('err', function (err) {
    return common.errors[400](res, err)
  })

  User.findUserByName(name, function (err, user) {
    if (err) {
      return ep.emit('err', err)
    }
    if (user && user.name === name && user.password === password) {
      middlewares.genSession(res, user)
      req.session.user = user
      return res.send(common.successResult())
    }
    else {
      return ep.emit('err', 'user not matched')
    }  
  })
}
