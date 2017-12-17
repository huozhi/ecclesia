'use strict'

const models = require('../models')
const Topic = models.Topic
const Discuss = require('./discuss')
const handleError = require('../common').handleError

Topic.findByIds = function (topicIds, callback) {
  Topic.find({ '_id': { $in: topicIds } }, function (err, topics) {
    handleError(err, callback)
    callback(null, topics)
  })
}

Topic.create = function (title, impress, charts, callback) {
  var topic = new Topic()
  topic.title = title
  topic.impress = impress || []
  topic.charts = charts || []
  topic.save(callback)
}

module.exports = Topic
