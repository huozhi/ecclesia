var common = require('../common')
var User = require('../proxy').User
var Discuss = require('../proxy').Discuss
var Eventproxy = require('eventproxy')

exports.index = function (req, res, next) {
  var user = req.session.user
  var promise = Discuss.find().exec()
  .then(function(discusses) {
    return res.render('history/panel', { discusses: discusses });
  })
  .catch(function(err) {
    return common.errors[500](res, err.message);
  })
}


exports.getDiscussDetail = function (req, res, next) {
  console.log(req.query)
  var host = req.query.host
  var query
  User.findUserByName(host, function (host) {
    query = {
      room: req.query.room,
      date: new Date(req.query.date),
      host: host
    }
    console.log('get discuss query', query)
    Discuss.findDiscussByQuery(query, {}, function (err, discuss) {
      if (err) {
        console.log(err)
        return next(err)
      }
      return res.render(
        'history/details',
        { discuss: discuss }
      )
    })
  })
}

