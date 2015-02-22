var fs = require('fs');
var Discuss = require('../proxy').Discuss;
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var ChartModel = require('../models').Chart;

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
  if (type === 'chart') {
    var chart = new ChartModel();
    chart.labels = req.body.labels;
    chart.values = req.body.values;
    console.log(chart);
  }
  else if (type === 'impress') {

    var impress = req.files.impress;
    console.log(impress.path);
    fs.readFile(impress.path, 'utf-8', function (err, content) {
      if (err) { res.send(false); return next(); }
      console.log(content);
      return res.send(true);
    });
    
  }
  // then save to the discuss corrosponding to the specific title
};



