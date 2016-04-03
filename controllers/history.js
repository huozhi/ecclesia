'use strict'

var common = require('../common')
var User = require('../proxy').User
var Discuss = require('../proxy').Discuss
var Eventproxy = require('eventproxy')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

exports.index = function (req, res, next) {
  var user = req.session.user
  var ep = Eventproxy()
  ep.all(['complete', 'info_all'], function(result, discusses) {
    console.log('finall_dis', discusses.length)
    return res.render('history/panel', { discusses: discusses });
  })
  var promise = Discuss.findByIds(user.discusses).lean().exec()
  .then(function(discusses) {
    var len = discusses.length
    if (len === 0) {
      ep.emit('info_all', discusses)
    }
    discusses.forEach(function(discuss, dIdx, _discuesses) {
      // console.log('discuss', discuss)
      var participants = discuss.participants || []
      console.log('participants', participants)

      User.findById(discuss.host).exec()
      .then(function(user) {
        console.log('username', user.name, _discuesses[dIdx].host)
        _discuesses[dIdx].host = user.name

        console.log('_discuesses[dIdx].host', _discuesses[dIdx].host)
        if (--len <= 0)
          ep.emit('info_all', _discuesses)
      })
      .catch(function(err) {
        console.error(err)
      })
    })
    ep.emit('complete')

  })
  .catch(function(err) {
    return common.errors[500](res, err.message);
  })
}


exports.getDiscussDetail = function (req, res, next) {
  console.log(req.query)
  var host = req.query.host
  var query
  User.findUserByName(host, function (host) {
    query = {
      room: req.query.room,
      date: new Date(req.query.date),
      host: host
    }
    console.log('get discuss query', query)
    Discuss.findDiscussByQuery(query, {}, function (err, discuss) {
      if (err) {
        console.log(err)
        return next(err)
      }
      return res.render(
        'history/details',
        { discuss: discuss }
      )
    })
  })
}
