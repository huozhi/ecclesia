'use strict'

const common = require('../common')
const User = require('../proxy').User
const Discuss = require('../proxy').Discuss
const Eventproxy = require('eventproxy')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const logger = require('log4js').getLogger()

exports.index = function (req, res, next) {
  const user = req.session.user
  const ep = Eventproxy()
  ep.all(['complete', 'info_all'], function(result, discusses) {
    logger.debug('history.index finall discusses', discusses.length)
    return res.render('history/panel', { discusses: discusses });
  })
  Discuss.findByIds(user.discusses, true)
  .then(function(discusses) {
    var len = discusses.length
    if (len === 0) {
      ep.emit('info_all', discusses)
    }
    discusses.forEach(function(discuss, dIdx, _discuesses) {
      // console.log('discuss', discuss)
      var participants = discuss.participants || []
      logger.debug('participants', participants)

      User.findById(discuss.host).exec()
      .then(function(user) {
        logger.debug('username', user.name, _discuesses[dIdx].host)
        _discuesses[dIdx].host = user.name

        logger.debug('_discuesses[dIdx].host', _discuesses[dIdx].host)
        if (--len <= 0)
          ep.emit('info_all', _discuesses)
      })
      .catch(function(err) {
        logger.error('history.index', err)
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
