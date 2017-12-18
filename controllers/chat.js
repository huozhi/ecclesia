'use strict'

const fs = require('fs')
const logger = require('log4js').getLogger()
const Discuss = require('../proxy').Discuss
const User = require('../proxy').User
const common = require('../common')

// simply sync impress
const sync = (req, res, next) => {
  logger.debug('chat.sync', req.body)
  const {discussId, slides} = req.body
  Discuss.updateImpress(discussId, slides)
    .then(
      () => res.send(common.successResult()),
      () => res.send(common.errors(res, 500))
    )
}

const index = (req, res, next) => {
  const {user, room} = req.session
  return res.render('chat/chat', {user, room})
}

exports.index = index
exports.sync = sync
