'use strict';

var fs = require('fs');
var Discuss = require('../proxy').Discuss;
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var ChartModel = require('../models').Chart;
var TopicModel = require('../models').Topic;
var handleError = require('../common').handleError;


var test = function (req, res, next) {
  return res.render('test', {});
};


var index = function (req, res, next) {
  return res.render('chat/chat', {
    // session: req.session,
    // username: req.session.user,
    // host: req.session.user === req.session.host
  });  
};

var topics = function (req, res, next) {
  // var query = req.body.info;
  var discuss = req.body.discuss;
  Discuss.findTopics(discuss._id, function (err, topics) {
    handleError(err, next);
    return res.json({
      response: true,
      topics: topics
    });
  });
};

var upload = function (req, res, next) {
  var type = req.params.type;
  var title = req.body.title;
  var topic;

  Topic.findByIds(title._id, function (err, result) {
    if (err) {
      topic = new TopicModel();
      topic.title = title.title;
    }
    else {
      topic = result;
    }
    if (type === 'chart') {
      var chart = new ChartModel();
      var data = req.body.data;
      chart.type = data.type;
      chart.labels = data.labels;
      chart.values = data.values;
      topic.chart.push(chart);
      console.log(chart);
      // no data send back to client, client use websocket to broadcast
      return res.json({
        response: true
      });
    }
    else if (type === 'impress') {
      var impress = req.files.impress;
      topic.impress.push(impress);
      console.log(impress.path);
      fs.readFile(impress.path, 'utf-8', function (err, source) {
        // split source into 10 pages, maximum
        if (err) { res.send(false); return next(); }
        var pages = source.split('/\+{6,}/', 10);
        console.log(pages);
        return res.json({
          response: true,
          pages: pages
        });
      });
    }
    
  });

};


exports.index = index;
exports.test = test;
exports.topics = topics;
exports.upload = upload;


