var express = require('express'); 
var router = express.Router();

var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');
var ObjectID = require('mongodb').ObjectID;
var compresser = require('../modules/compresser.js');


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

router.post('/upload-img', function (req, res){
  var target = {
    roomName : req.session.roomName,
    host : req.session.host,
    date : req.session.date,
    listName : req.body.request,
    page : req.body.page,
    img : compresser.uncompress(req.body.img),
  };

  Meeting.saveImg(target, function (err, result){
    if(!err){
      res.json({response : "upload-success", id : result._id});
    }
  });
});

router.post('/refresh-img', function (req, res){
  var type = req.body.request;
  var roomName = req.session.roomName;
  var host = req.session.host;
  var date = req.session.date;

  Meeting.queryConference("world cup", "heale", "2014/9/13", function (err, conference){
    if(!err){
      var resList = [];
      console.log(conference.ChartList);
      if(type === "chart"){
        resList = conference.ChartList;
        console.log('chart type');
        return res.json({response : "refresh-success", ChartList : resList})
      }
      else if(type === "sketch"){
        resList = conference.SketchList;
        console.log('sketch type');
        return res.json({response : "refresh-success", SketchList : resList})
      }
      else {
        console.log('err type');

      }
    }
  });
});

router.post('/query-img', function (req, res){
  console.log(req.body.id);
  var objId = new ObjectID(req.body.id);

  Meeting.queryImg(objId, function (err, image){
    if(!err){
      var s = new Date().getTime();
      image.img = compresser.compress(image.img);
      var e = new Date().getTime();
      console.log(e-s);
      return res.json({response : "query-img-success", img : image});
    }
  });
});


module.exports = router;