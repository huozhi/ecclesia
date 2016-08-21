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

Discuss.findTopics = function (discuss) {
  this.findById(discuss._id).exec()
}

Discuss.insertTopic = function (discuss, newTopic, callback) {
  return Discuss.findByIdAndUpdate(
    discuss._id,
    { $push: { topics: newTopic } },
    { safe: true, upsert: true }
  ).exec()
}

Discuss.addParticipant = function (discuss, user) {
  logger.debug('inner addParticipant', discuss, user.account)
  return Discuss.update(
    { _id: discuss._id },
    { $addToSet: { participants: user.account } }
  ).exec()
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
