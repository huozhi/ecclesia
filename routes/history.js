var express = require('express');
var router = express.Router();
var Meeting = require('../modules/meeting');

router.get('/', function (req, res) {
  res.render('history');
});

router.post('/query-history', function (req, res){
  // console.log(req.body);
  var roomName = req.body.roomName;
  var host = req.body.host;
  var date = req.body.date;
  console.log('post data', roomName,host,date);
  Meeting.queryConference(roomName, host, date, function (err, result){
    if(!err){
      console.log(result);
      res.json({val:'hello', data:result});
    }
  });
});

router.get('/history-detail', function (req, res) {
  res.render('history-detail');
});

module.exports = router;
