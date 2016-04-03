module.exports = function(req, res, user) {
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true
  }
  req.session.user = user
  res.cookie('c_u', user._id)
}
