var models = require('../models');
var Discuss = models.Discuss;
var User = require('./user');

exports.findDiscussByQuery = function (query, opts, callback) {
  Discuss.find(query, '', opts, callback);
};

exports.findDiscussByIds = function (discussIds, callback) {
  Discuss.find({ '_id': { $in: discussIds } },
    function (err, discusses) {
      if (err) {
        return callback(err);
      }
      callback(null, discusses);
  });
};

exports.findTopicsByDiscuss = function (discuss, callback) {
  Discuss.findById(discuss._id, function (err, discuss) {
    if (err) {
      console.log(err); return callback(err);
    }
    callback(null, discuss.topics);
  })
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


