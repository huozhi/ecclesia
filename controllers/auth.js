const express = require('express')
const crypto = require('crypto')
const common = require('../common')
const User = require('../proxy').User
const UserModel = require('../models').User
const Eventproxy = require('eventproxy')
const genSession = require('../middlewares/session')

exports.index = function (req, res) {
  if (req.session.user) {
    console.log('has session, redirect')
    res.redirect('/home', {
      user: req.session.user
    })
  } else {
    console.log('rendering...')
    res.render('index')
  }
}


exports.signup = function (req, res, next) {
  console.log(req.body)
  var account = req.body.account
  var password = req.body.password
  var passrept = req.body.passrept
  var email    = req.body.email

  if (passrept !== password) {
    return common.errors[400](res, 'password not matched in repeating')
  }
  // TODO: encrypt password
  User.register(account, password, email)
  .then(function(newUser) {
    console.log(newUser)
    genSession(req, res, newUser)
    return res.send(common.successResult())
  })
  .catch(function(err) {
    console.error(err)
    return common.errors[500](res, err)
  })
}


exports.login = function (req, res, next) {
  var account = req.body.account
  var password = req.body.password

  var findUserMethod
  if (~account.indexOf('@')) {
    findUserMethod = User.findUserByMail
  }
  else {
    findUserMethod = User.findUserByName
  }

  findUserMethod(account)
  .then(function(user) {
    if (user.name === account && user.password === password) {
      console.log(user)
      genSession(req, res, user)
    }
    return res.send(common.successResult())
  })
  .catch(function(err) {
    common.errors[500](res, err)
  })
}


exports.logout = function(req, res) {
  req.session.destroy()
  res.clearCookie('c_u')
  return res.redirect('/')
}
