var models = require('../models');
var Topic = models.Topic;
var Discuss = require('./discuss');

exports.findTopicsByIds = function (topicIds, callback) {
  Topic.find({ '_id': { $in: topicIds } }, function (err, topics) {
    if (err) {
      console.log(err); return callback(err);
    }
    callback(null, topics);
  });
};


exports.insertCharts = function(tpoic, chart, callback) {
  Topic.findByIdAndUpdate(
    tpoic._id,
    { $push: { 'charts': chart } },
    { safe: true, upsert: true },
    function (err, topic) {
      if (err) {
        console.log(err); return callback(err);
      }
      callback(null, topic);
    }
  );
}

exports.insertImpress = function (topic, impress, callback) {
  Topic.findByIdAndUpdate(
    tpoic._id,
    { $push: { 'impress': impress } },
    { safe: true, upsert: true },
    function (err, topic) {
      if (err) {
        console.log(err); return callback(err);
      }
      callback(null, topic);
    }
  );
}


exports.create = function (title, impress, charts, callback) {
  var topic = new Topic();
  topic.title = title;
  topic.impress = impress || [];
  topic.charts = charts || [];
  topic.save(callback);
};