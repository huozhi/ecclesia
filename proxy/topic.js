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

Topic.findByQuery = function (query, opts, callback) {
  Topic.find(query, '', opts, function (err, topics) {
    handleError(err, callback)
    callback(null, topics)
  })
}

Topic.insertChart = function(tpoic, chart, callback) {
  Topic.findByIdAndUpdate(
    tpoic._id,
    { $push: { 'charts': chart } },
    { safe: true, upsert: true },
    function (err, topic) {
      handleError(err, callback)
      callback(null, topic)
    }
  )
}

Topic.insertImpress = function (topic, impress, callback) {
  Topic.findByIdAndUpdate(
    tpoic._id,
    { $push: { 'impress': impress } },
    { safe: true, upsert: true },
    function (err, topic) {
      handleError(err, callback)
      callback(null, topic)
    }
  )
}


Topic.create = function (title, impress, charts, callback) {
  var topic = new Topic()
  topic.title = title
  topic.impress = impress || []
  topic.charts = charts || []
  topic.save(callback)
}

module.exports = Topic
