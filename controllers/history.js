var User = require('../proxy').User;
var Discuss = require('../proxy').Discuss;

exports.index = function (req, res, next) {
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
  var query = {
    room: req.params.room,
    host: req.params.host,
    date: req.params.date
  };  
  Discuss.findDiscussByQuery(query, {}, function (err, discuss) {
    if (err) {
      console.log(err); return next(err);
    }
    return res.render(
      'history/details',
      { discuss: discuss }
    );
  });
};

