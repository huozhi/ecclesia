var express = require('express');
var router = express.Router();

router.get('/chat', function(req, res) {
  res.render('chat');
})

exports.signupRouter  = require('./signup');
exports.signinRouter  = require('./signin');
exports.homeRouter    = require('./home');
exports.historyRouter = require('./history');

module.exports = router;
