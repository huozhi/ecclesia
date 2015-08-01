var models = require('../models');
var Discuss = models.Discuss;
var User = require('./user');
var handleError = require('../common').handleError;


exports.findDiscussByQuery = function (query, opts, callback) {
  Discuss.find(query, '', opts, function (err, discusses) {
    if (err) {
      return callback(err);
    }
    callback(null, discusses);
  });
};

exports.search = function (info, callback) {
  Discuss.findOne(info, function (err, discuss) {
    if (err) {
      return callback(err);
    }
    callback(null, discuss);
  });
};

exports.findById = function (discussId, callback) {
  Discuss.findById(discussId, function (err, discuss) {
    handleError(err, callback);
    callback(null, discuss);
  });
};

exports.findByIds = function (discussIds, callback) {
  Discuss.find({ '_id': { $in: discussIds } },
    function (err, discusses) {
      handleError(err, callback);
      callback(null, discusses);
  });
};

exports.findTopics = function (discuss, callback) {
  this.findById(discuss._id, function (err, discuss) {
    handleError(err, callback);
    callback(null, discuss.topics);
  });
};

exports.insertTopic = function (discuss, newTopic, callback) {
  Discuss.findByIdAndUpdate(
    discuss._id,
    { $push: { "topics": newTopic } },
    { safe: true, upsert: true },
    function (err, discuss) {
      if (err) {
        console.log (err); return callback(err);
      }
      callback(null, discuss);
    }
  );
};

exports.addParticpant = function (disscuss, user, callback) {
  Discuss.findByIdAndUpdate(
    discuss._id,
    { $push: { 'participants': user._id } },
    { safe: true, upsert: true },
    function (err, discuss) {
      if (err) { console.log(err); return callback(err); }
      callback(null, discuss);
    }
  );
};

exports.create = function (room, host, topics, callback) {
  var discuss = new Discuss();
  discuss.room = room;
  discuss.host = host;
  discuss.participants = [ host ];
  discuss.topics = topics || [];
  discuss.save(callback);
};


