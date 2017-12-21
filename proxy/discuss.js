const mongoose = require('mongoose')
const logger = require('log4js').getLogger()
const ObjectId = mongoose.Types.ObjectId
const Discuss = require('../models').Discuss
const User = require('./user')


Discuss.findByQuery = function (query, opts) {
  return Discuss.find(query, '', opts).exec()
}

Discuss.findByIds = function (ids) {
  const query = Discuss.find({_id: {$in: ids}})
  return query.sort({date: -1}).lean().exec()
}

Discuss.addParticipant = function (discuss, user) {
  return Discuss
    .where({ _id: discuss._id })
    .update({ $addToSet: { participants: user.account } })
    .exec()
}

Discuss.updateImpress = function(discussId, impressList) {
  logger.debug('update impress', discussId, impressList)
  return Discuss
    .where({ _id: discussId })
    .update({ $set: { impress: impressList } })
    .exec()
}

Discuss.create = function (room, host, topics) {
  var discuss = new Discuss()
  discuss.room = room
  discuss.date = new Date()
  discuss.host = host._id
  discuss.participants = [host.account]
  discuss.topics = topics || []
  return discuss.save()
}

module.exports = Discuss
