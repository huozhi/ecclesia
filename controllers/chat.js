'use strict'

const fs = require('fs')
const Discuss = require('../proxy').Discuss
const User = require('../proxy').User
const Topic = require('../proxy').Topic
const ChartModel = require('../models').Chart
const TopicModel = require('../models').Topic
const common = require('../common')


const sync = (req, res, next) => {
  return res.send(common.successResult())
}

const index = (req, res, next) => {
  const {user, room} = req.session
  return res.render('chat/chat', {user, room})
}

const topics = (req, res, next) => {
  var {discuss} = req.body
  Discuss.findTopics(discuss._id, (err, topics) => {
    if (err) {
      return common.erros[500](res, err)
    }
    return res.send({
      topics: topics
    })
  })
}

var upload = (req, res, next) => {
  var type = req.params.type
  var title = req.body.title
  var topic

  Topic.findByIds(title._id, function (err, result) {
    if (err) {
      topic = new TopicModel()
      topic.title = title.title
    }
    else {
      topic = result
    }
    if (type === 'chart') {
      var chart = new ChartModel()
      var data = req.body.data
      chart.type = data.type
      chart.labels = data.labels
      chart.values = data.values
      topic.chart.push(chart)
      console.log(chart)
      // no data send back to client, client use websocket to broadcast
      return res.send(common.successResult())
    }
    else if (type === 'impress') {
      var impress = req.files.impress
      topic.impress.push(impress)
      console.log(impress.path)
      fs.readFile(impress.path, 'utf-8', function (err, source) {
        // split source into 10 pages, maximum
        if (err) {
          return common.erros[500](res, err)
        }
        var pages = source.split('/\+{6,}/', 10)
        console.log(pages)
        return res.json({
          pages: pages
        })
      })
    }
  })
}


exports.index = index
exports.sync = sync
exports.topics = topics
exports.upload = upload
