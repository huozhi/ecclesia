
exports.auth = function (req, res, next) {
  if (!req.session || !req.session.user) {
    res.render('index', { form:  'auth/reg.html' });
  }
  next();
}
