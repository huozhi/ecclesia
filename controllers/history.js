var User = require('../proxy').User;
var Discuss = require('../proxy').Discuss;
var Eventproxy = require('eventproxy');

var testHistoryMessage = [{
  room: 'team discuss',
  host: 'hz',
  date: '2014-02-19',
  participates: ['hz', 'dh', 'lsn']
}];

exports.index = function (req, res, next) {
  return res.render('history/panel', {
    // test
    meetings: testHistoryMessage
  });
  var username = req.session.user;
  User.findDiscussesByUserName(
    username,
    function (err, discussess) {
      if (err) {
        console.log(err);
        // unhandled query history error
        return next(err);
      }
      return res.render(
        'history/panel',
        { discussess: discussess }
      );
  });
};


exports.getDiscussDetail = function (req, res, next) {
  var host = req.params.host;
  var query;
  User.findUserByName(host, function (host) {
    query = {
      room: req.params.room,
      date: req.params.date,
      host: host
    };
    console.log('get discuss query', query);
    Discuss.findDiscussByQuery(query, {}, function (err, discuss) {
      if (err) {
        console.log(err); return next(err);
      }
      return res.render(
        'history/details',
        { discuss: discuss }
      );
    });
  });
};

