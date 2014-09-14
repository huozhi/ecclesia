var express = require('express'); 
var router = express.Router();
var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');
//var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs');


router.get('/', function (req, res) {
  res.render('chat');
});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  Meeting.saveMdTemp(req.session.roomName, req.session.host, req.session.username, markdowns, function(err, result){
    if(!err){
      //do sth
    }
  });
  //console.log(req.body.text);
  if (t == undefined) {
    return res.send('1');
  }
  else
    return res.send('2');
});

router.post('/upload-img', function (req, res){
  var target = {
    roomName : req.session.roomName,
    host : req.session.host,
    date : req.session.date,
    listName : req.body.listName,
    page : req.body.page,
    img : req.body.img,
  };

  Meeting.saveImg(target, function (err, result){
    if(!err){
      res.json({response : "upload-success", id : result._id});
    }
  });
});

module.exports = router;