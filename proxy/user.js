var models = require('../models');
var Discuss = models.Discuss;
var User = models.User;


exports.findUserByAuth = function (username, password, callback) {
  User.findOne({
    'usernmae': username, 
    'password': password }, callback);
};

exports.findUserByName = function (username, callback) {
  User.findOne({
    'username': username }, callback);
};

exports.findUsersByQuery = function (query, opts, callback) {
  User.find(query, '', opts, callback);
};

exports.findUserByMail = function (email, callback) {
  User.findOne({
    'email': email
  }, callback);
}

exports.findDiscussesByUserName = function (username, callback) {
  User.findUserByName(user.username, function (err, user) {
    if (err) {
      console.log(err); callback(err);
    }
    Discuss.findDiscussByIds(
      user.discusses,
      function (err, discusses) {
        if (err) {
          console.log(err);
          callback(null, discusses);
        }
    });
  });
};


exports.register = function (username, password, email, callback) {
  var user = new User();
  user.username = username;
  user.password = password;
  user.email    = email;
  user.save(callback);
};
