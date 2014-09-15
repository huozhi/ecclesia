var express = require('express'); 
var router = express.Router();
// var formidable = require('formidable');
var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');


router.get('/', function (req, res) {
  var uname = "test" || req.session.username;
  res.render('chat', {
    username: uname
  });
});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  console.log(markdowns);

  // test
  Meeting.saveMdTemp('roomName', 'host', 
    'username', markdowns, function(err, result){
    if (!err) {
      
      return res.json({ response: 'upload-markdown-success',
                       markdowns: markdowns });
    } else {
      return res.json({response: 'upload-markdown-failed'});
    }
  });

  // Meeting.saveMdTemp(req.session.roomName, req.session.host, 
  //   req.session.username, markdowns, function(err, result){
  //   if (!err) {
  //     return res.json({response: 'upload-markdown-success',
  //                      markdowns: markdowns
  //                   });
  //   } else {
  //     return res.json({response: 'upload-markdown-failed'});
  //   }
  // });
});

router.post('/upload-chart', function (req, res){
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
      res.json({response : "upload-success", page : result.page});
    }
  });
});

module.exports = router;