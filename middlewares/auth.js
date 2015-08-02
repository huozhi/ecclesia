exports.auth = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return next();
  }
  next();
}

exports.genSession = function (res, user) {
  var authToken = user._id
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true
  };
  res.cookie('authToken', authToken)
}