'use strict';

var express = require('express');

var crypto = require('crypto');
var Render = require('../common/').Render;
var User = require('../proxy').User;
var Eventproxy = require('eventproxy');

exports.index = function (req, res, next) {
  return Render(req, res, 'index', 'auth/reg', {
    user_form: 'auth/reg.html'
  });
};

exports.registerAction = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var passrept = req.body.passrept;
  var email    = req.body.email;

  if (passrept !== password) {
    console.log('password repeate not matched');
    return index(req, res, next);
  }

  User.register(username, password, email, function (err, newuser) {
    if(err) {
      res.status(403);
      return res.json({ response: false });
    }
    req.session.user = username;      
    return res.json({ response: true, username: username });
  });
};

exports.loginView = function (req, res, next) {
  return Render(req, res, 'index', 'auth/login', {
    user_form: 'auth/login.html'
  });
};

exports.loginAction = function (req, res, next) {
  console.log('recieve', req.get('Content-Type'));
  console.log('body', req.body);
  var loginname = req.body.username;
  var loginpwd = String(req.body.password);
  
  var findUserMethod;
  if (loginname.indexOf('@') !== -1) {
    findUserMethod = User.findUserByMail;
  }
  else {
    findUserMethod = User.findUserByName;
  }

  var ep = new Eventproxy();
  ep.fail(next);
  ep.on('login_error', function (message) {
    res.json({ response: false, message: message });
  });

  User.findUserByName(loginname, function (err, user) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (user && user.username === loginname && user.password === loginpwd) {
      res.json({ response: true, username: loginname });
    }
    else {
      ep.emit('login_error', 'dont know');
    }  
  });
};
