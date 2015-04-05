var fs = require('fs');
var DiscussProxy = require('../proxy').Discuss;
var UserProxy = require('../proxy').User;
var TopicProxy = require('../proxy').Topic;
var ChartModel = require('../models').Chart;
var TopicModel = require('../models').Topic;

exports.test = function (req, res, next) {
  return res.render('test', {});
};

exports.index = function (req, res, next) {
  return res.render('chat/chat', {
    // session: req.session,
    // username: req.session.user,
    // host: req.session.user === req.session.host
  });  
};

exports.upload = function (req, res, next) {
  var type = req.params.type;
  var title = req.body.title;
  var topic;
  TopicProxy.findByTitle(title, function (err, result) {
    if (err) {
      topic = new TopicModel();
      topic.title = title;
    }
    else {
      topic = result;
    }
    if (type === 'chart') {
      var chart = new ChartModel();
      chart.labels = req.body.labels;
      chart.values = req.body.values;
      topic.chart.push(chart);
      console.log(chart);
    }
    else if (type === 'impress') {
      var impress = req.files.impress;
      topic.impress.push(impress);
      console.log(impress.path);
      fs.readFile(impress.path, 'utf-8', function (err, content) {
        if (err) { res.send(false); return next(); }
        console.log(content);
        return res.send(true);
      });
    }
    topic.save();
  });
};



