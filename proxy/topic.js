var models = require('../models');
var Topic = models.Topic;
var Discuss = require('./discuss');
var handleError = require('../common').handleError;



exports.findById = function (topicId, callback) {
  Topic.findOne({ '_id': topicId }, function (err, topic) {
    handleError(err, callback);
    callback(null, topic);
  });
};

exports.findByIds = function (topicIds, callback) {
  Topic.find({ '_id': { $in: topicIds } }, function (err, topics) {
    handleError(err, callback);
    callback(null, topics);
  });
};

exports.findByQuery = function (query, opts, callback) {
  Topic.find(query, '', opts, function (err, topics) {
    handleError(err, callback);
    callback(null, topics);
  });
};

exports.insertChart = function(tpoic, chart, callback) {
  Topic.findByIdAndUpdate(
    tpoic._id,
    { $push: { 'charts': chart } },
    { safe: true, upsert: true },
    function (err, topic) {
      handleError(err, callback);
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
      handleError(err, callback);
      callback(null, topic);
    }
  );
};


exports.create = function (title, impress, charts, callback) {
  var topic = new Topic();
  topic.title = title;
  topic.impress = impress || [];
  topic.charts = charts || [];
  topic.save(callback);
};

