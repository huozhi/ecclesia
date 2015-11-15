var models = require('../models');
var Discuss = models.Discuss;
var User = require('./user');
var handleError = require('../common').handleError;


Discuss.findDiscussByQuery = function (query, opts, callback) {
  Discuss.find(query, '', opts, function (err, discusses) {
    if (err) {
      return callback(err);
    }
    callback(null, discusses);
  });
};


Discuss.findByIds = function (idArray, callback) {
  return Discuss.find({ _id: { $in: idArray } })
};


Discuss.findTopics = function (discuss, callback) {
  this.findById(discuss._id, function (err, discuss) {
    handleError(err, callback);
    callback(null, discuss.topics);
  });
};

Discuss.insertTopic = function (discuss, newTopic, callback) {
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

Discuss.addParticpant = function (disscuss, user, callback) {
  Discuss.update(
    { _id: discuss._id },
    { $push: { 'participants': user.name } },
    { safe: true, upsert: true },
    function (err, discuss) {
      if (err) { console.log(err); return callback(err); }
      callback(null, discuss);
    }
  );
};

Discuss.create = function (room, host, topics, callback) {
  var discuss = new Discuss();
  discuss.room = room;
  discuss.host = host._id;
  discuss.participants = [ host.name ];
  discuss.topics = topics || [];
  discuss.save(callback);
};

module.exports = Discuss;
