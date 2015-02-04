var express = require('express');
var router = express.Router();
// var Meeting = require('../modules/meeting');
// var User = require('../modules/user');
var ObjectID = require('mongodb').ObjectID;

var User = require('../proxy').User;
var Discuss = require('../proxy').Discuss;

exports.index = function (req, res) {
  var username = req.session.user;
  User.findDiscussesByUserName(
    username,
    function (err, discussess) {
      if (err) {
        console.log(err);
        // unhandled query history error
        return;
      }
      res.render('history/panel',
        discussess: discussess
      );
  });
};


router.get('/history', index);


router.post('/query', function (req, res){
  var room = req.body.room;
  var host = req.body.host;
  var date = req.body.date;
  Meeting.queryHistory(room, host, date, function (err, result){
    if(err){
      console.log(err);
      return res.json(null);
    } else {
      return res.json(result);
    }
  });
});

router.post('/details', function (req, res) {
  res.render('history/details');
});

router.post('/details', function (req, res) {
  var objId = new ObjectID(req.body.id.toString());
  Meeting.queryImg(objId, function (err, result){
    if(err){
      return res.json({response: false, image: null});
    
    return res.json({response : false, image : result});      
  });
});

module.exports = router;
