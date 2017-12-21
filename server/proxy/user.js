'use strict'

const Discuss = require('../models/discuss')
const User = require('../models/user')

User.findByAuth = (account, password) => {
  return User.findOne({account, password}).exec()
};

User.findByName = (account) => {
  return User.findOne({account}).exec()
};

User.findUsersByQuery = function (query, opts, callback) {
  return User.find(query, '', opts, callback).exec()
};

User.findByMail = function (email, callback) {
  User.findOne({
    'email': email
  }, callback).exec()
}

User.findDiscussesByUserName = (account, callback) => {
  User.findByName(account)
  .then(function(user) {
    return Discuss.findDiscussByIds(user.discusses).exec()
  })
  .then(function(discusses) {
    return callback(null, discusses)
  })
}

User.register = (account, password, email) => {
  const user = new User()
  user.account = account
  user.password = password
  user.email = email
  return user.save()
}

module.exports = User
