var express = require('express');
var router = express.Router();
var Meeting = require('../modules/meeting');
var User = require('../modules/user');
var compresser = require('../modules/compresser.js');
var ObjectID = require('mongodb').ObjectID;

router.get('/', function (req, res) {
  console.log(req.session.username);
  res.render('history');
});

router.post('/history-preview', function (req, res){
  var user = req.session.username;
  console.log(user);
  User.get(user, function (err, result){
    if(!err){
      res.json(result.conferences);
    }
  })
})

router.post('/query-history', function (req, res){

  var roomName = req.body.roomName;
  var host = req.body.host;
  var date = req.body.date;
  Meeting.queryHistory(roomName, host, date, function (err, result){
    if(!err){
      return res.json(result);
    } else {
      return res.json(null);
    }
  });
});

router.get('/history-detail', function (req, res) {
  return res.render('history-detail');
});

router.post('/history-detail', function (req, res) {
  //console.log(req.body);
  var objId = new ObjectID(req.body.id.toString());
  console.log(objId.toString());
  // console.log(req.body.id);
  Meeting.queryImg(objId, function (err, result){
    if(!err){
      // result.img = compresser.compress(result.img);
      console.log('no err');
      return res.json({response : "query-detail-success", image : result});      
    } else {
      console.log('err in queryImg');
      return res.json({response: "query-detail-failed", image: null});
    }
  });
})
module.exports = router;
