var common = require('../common');
var User = require('../proxy').User;

// bad designe, I do SQL query here..
exports.auth = function (req, res, next) {
  if (!req.session || !req.session.user) {
    var authToken = req.cookies.authToken;
    // console.log(authToken)
    User.findById(authToken).exec()
    .then(function(user) {
      req.session.user = user
      // console.log(user);
      return next();
    });
  }
  else
    next();
};

exports.genSession = function (res, user) {
  var authToken = user._id
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true
  };
  console.log('genSession', authToken)
  res.cookie('authToken', authToken)
}