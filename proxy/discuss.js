const Discuss = require('../models').Discuss
const User = require('./user')


Discuss.findDiscussByQuery = function (query, opts) {
  return Discuss.find(query, '', opts).exec()
}

Discuss.findByIds = function (ids) {
  return Discuss.find({ _id: { $in: ids } }).exec()
}

Discuss.findTopics = function (discuss) {
  this.findById(discuss._id).exec()
}

Discuss.insertTopic = function (discuss, newTopic, callback) {
  return Discuss.findByIdAndUpdate(
    discuss._id,
    { $push: { "topics": newTopic } },
    { safe: true, upsert: true }
  ).exec()
}

Discuss.addParticipant = function (discuss, user) {
  return Discuss.update(
    { _id: discuss._id },
    { $push: { 'participants': user.name } },
    { safe: true, upsert: true }
  ).exec()
}

Discuss.create = function (room, host, topics) {
  var discuss = new Discuss()
  discuss.room = room
  discuss.host = host._id
  discuss.participants = [ host.name ]
  discuss.topics = topics || []
  return discuss.save()
}

module.exports = Discuss
