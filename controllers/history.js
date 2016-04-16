'use strict'

const querystring = require('querystring')
const Eventproxy = require('eventproxy')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const logger = require('log4js').getLogger()
const common = require('../common')
const User = require('../proxy').User
const Discuss = require('../proxy').Discuss

exports.index = function (req, res, next) {
  const user = req.session.user
  const ep = Eventproxy()
  ep.all(['complete', 'info_all'], function(result, discusses) {
    discusses = discusses.map(discuss => {
      discuss['params'] = querystring.stringify({
        room: discuss.room,
        host: discuss.host,
        date: discuss.date.toISOString(),
      })
      return discuss
    })
    return res.render('history/panel', {
      discusses: discusses
    })
  })
  Discuss.findByIds(user.discusses, true)
  .then(function(discusses) {
    var len = discusses.length
    if (len === 0) {
      logger.debug('discuesses', discuesses)
      ep.emit('info_all', discusses)
    }
    discusses.forEach(function(discuss, i, _self) {
      var participants = discuss.participants || []
      logger.debug('participants', participants)

      User.findById(discuss.host).exec()
      .then(function(user) {
        _self[i].host = user.name
        if (--len <= 0) {
          ep.emit('info_all', _self)
        }
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


exports.getDiscussDetail = function(req, res, next) {
  const hostName = req.query.host
  const date = req.query.date
  User.findByName(hostName)
  .then(function(hostUser) {
    logger.debug('history.getDiscussDetail', 'hostUser', hostUser)
    const query = {
      room: req.query.room,
      host: hostUser._id,
      date: {
        $eq: new Date(date)
      },
    }
    logger.debug('history.getDiscussDetail', 'query', query)
    return Promise.resolve(query)
  })
  .then(function(query) {
    logger.debug('findByQuery', 'query', query)
    Discuss.findOne(query)
    .then(function(discuss) {
      logger.debug('history.getDiscussDetai', 'findOne', discuss)
      return res.render(
        'history/details',
        { discuss: discuss }
      )
    })
  })
  .catch(function(err) {
    logger.error('history.getDiscussDetail', err)
    return common.errors(res, 500, err)
  })
}
