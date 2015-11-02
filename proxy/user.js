var models = require('../models');
var Discuss = models.Discuss;
var User = models.User;


User.findUserByAuth = function (name, password, callback) {
  User.findOne({
    'name': name, 
    'password': password }, callback);
};

User.findUserByName = function (name, callback) {
  User.findOne({
    'name': name }, callback);
};

User.findUsersByQuery = function (query, opts, callback) {
  User.find(query, '', opts, callback);
};

User.findUserByMail = function (email, callback) {
  User.findOne({
    'email': email
  }, callback);
}

User.findDiscussesByUserName = function (name, callback) {
  User.findUserByName(user.name, function (err, user) {
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


User.register = function (name, password, email, callback) {
  var user = new User();
  user.name = name;
  user.password = password;
  user.email    = email;
  user.save(callback);
};

module.exports = User