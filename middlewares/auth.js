var common = require('../common')
var User = require('../proxy').User


module.exports = function(req, res, next) {
  if (req.session && req.session.user) {
    return next()
  }
  var c_u = req.cookies['c_u']
  if (c_u) {
    return User.findById(c_u).exec()
    .then(function(user) {
      req.session.user = user
      return next()
    })
    .catch(function(err) {
      return next()
    })
  }
  return next()
}
