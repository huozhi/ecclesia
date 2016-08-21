'use strict'

const express = require('express')
const crypto = require('crypto')
const passport = require('passport')
const common = require('../common')
const User = require('../models/user')

exports.index = (req, res) => {
  const {user} = req.session
  if (user) {
    res.render('home', {user})
  } else {
    res.render('index')
  }
}

exports.signup = (req, res, next) => {
  const {account, password, email} = req.body
  User.register(account, password, email)
  .then(user => {
    passport.authenticate('local', (error, user) => {
      if (error) {
        return common.errors(res, 500, err)
      }
      return res.send({ret: true})
    })(req, res, next)
  })
  .catch(err => {
    return common.errors(res, 500, err)
  })
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) { next(err) }
    if (!user) {
      return common.errors(res, 401, {message: 'Unauthorized'})
    }
    return res.send({ret: true})
  })(req, res, next)
}

exports.logout = function(req, res) {
  req.logout()
  req.session.destroy()
  res.redirect('/')
}
