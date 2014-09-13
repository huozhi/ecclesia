var express = require('express');
var router = express.Router();
var Meeting = require('../modules/meeting');
var ObjectID = require('mongodb').ObjectID;

router.get('/', function (req, res) {
  res.render('history');
});

router.post('/query-history', function (req, res){

  var roomName = req.body.roomName;
  var host = req.body.host;
  var date = req.body.date;
  Meeting.queryConference(roomName, host, date, function (err, result){
    if(!err){
      res.json(result);
    }
  });
});

router.get('/history-detail', function (req, res) {
  res.render('history-detail');
});

router.post('/history-detail', function (req, res) {
  console.log(req.body);
  var objId = new ObjectID(req.body.id);
  Meeting.queryImg(objId, function (err, result){
    if(!err){
      res.json(result);      
    }
  });
})
module.exports = router;
