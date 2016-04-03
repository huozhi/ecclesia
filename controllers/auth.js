'use strict';

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
    res.redirect('/home')
  } else {
    console.log('rendering...')
    res.render('index')
  }
}


exports.signup = function (req, res, next) {
  console.log(req.body)
  const account = req.body.account
  const password = req.body.password
  const passrept = req.body.passrept
  const email    = req.body.email

  if (passrept !== password) {
    return common.errors(res, 400, 'password not matched in repeating')
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
    return common.errors(res, 500, err)
  })
}


exports.login = function (req, res, next) {
  const account = req.body.account
  const password = req.body.password
  const failMessage = {
    fail: { password: 'Not Correct' }
  }

  if (!common.validParams(account, password)) {
    common.errors(res, 400)
  }

  let findUserMethod
  if (~account.indexOf('@')) {
    findUserMethod = User.findUserByMail
  }
  else {
    findUserMethod = User.findUserByName
  }

  findUserMethod(account).then(function(user) {
    if (user &&
        user.name === account &&
        user.password === password) {
      console.log(user)
      genSession(req, res, user)
    } else {
      return res.send(failMessage)
    }
    return res.send(common.successResult())
  })
  .catch(function(err) {
    return common.errors(res, 500, err)
  })
}


exports.logout = function(req, res) {
  req.session.destroy()
  res.clearCookie('c_u')
  return res.redirect('/')
}
