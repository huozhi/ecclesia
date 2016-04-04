var models = require('../models');
var Discuss = models.Discuss;
var User = models.User;


User.findByAuth = function (name, password, callback) {
  return User.findOne({
    'name': name,
    'password': password }, callback).exec()
};

User.findByName = function (name, callback) {
  return User.findOne({
    'name': name }, callback).exec()
};

User.findUsersByQuery = function (query, opts, callback) {
  return User.find(query, '', opts, callback).exec()
};

User.findByMail = function (email, callback) {
  User.findOne({
    'email': email
  }, callback).exec()
}

User.findDiscussesByUserName = function (name, callback) {
  User.findUserByName(name).exec()
  .then(function(user) {
    return Discuss.findDiscussByIds(user.discusses).exec()
  })
  .then(function(discusses) {
    return callback(null, discusses)
  })
}

User.register = function (name, password, email, callback) {
  var user = new User()
  user.name = name
  user.password = password
  user.email = email
  return user.save() // already a promise
}

module.exports = User
