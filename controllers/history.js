'use strict'

const querystring = require('querystring')
const Eventproxy = require('eventproxy')
const mongoose = require('mongoose')
const logger = require('log4js').getLogger()
const common = require('../common')
const User = require('../proxy/user')
const Discuss = require('../proxy/discuss')

exports.index = function (req, res, next) {
  const {user} = req.session
  Discuss.findByIds(user.discusses)
  .then(results => {
    if (!results || results.length === 0) {
      return res.render('history/panel', {discusses: []})
    }
    const promises = results.map(result => {
      return User.findById(result.host).exec()
        .then(user => {
          return Object.assign({}, result, {host: user.account})
        })
    })
    Promise.all(promises)
    .then(discussArray => {
      const discusses = discussArray.map(discuss => {
        return Object.assign({}, discuss, {
          params: querystring.stringify({
            room: discuss.room,
            host: discuss.host,
            date: discuss.date.toISOString(),
          })
        })
      })
      res.render('history/panel', {discusses})
    })
    .catch(err => {
      logger.error(err.stack)
      return common.errors[500](res, err.message)
    })
  })
  .catch(function(err) {
    return common.errors[500](res, err.message)
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
