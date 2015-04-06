var fs = require('fs');
var Discuss = require('../proxy').Discuss;
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
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
  Topic.findByTitle(title, function (err, result) {
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
      // no data send back to client, client use websocket to broadcast
      return res.send({
        response: true
      });
    }
    else if (type === 'impress') {
      var impress = req.files.impress;
      topic.impress.push(impress);
      console.log(impress.path);
      fs.readFile(impress.path, 'utf-8', function (err, content) {
        // split content into 10 pages, maximum
        if (err) { res.send(false); return next(); }
        var pages = content.split('/\+{6}/', 10);
        console.log(pages);
        return res.send({
          response: true,
          pages: pages
        });
      });
    }
    topic.save();
  });
};



