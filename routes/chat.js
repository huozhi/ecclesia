var express = require('express'); 
var router = express.Router();

var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');
var ObjectID = require('mongodb').ObjectID;
var compresser = require('../modules/compresser.js');


router.get('/', function (req, res) {
  var uname = req.session.username || 'test';
  res.render('chat', {
    username: uname
  });
});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  var author = req.body.username;
  
  Meeting.seveMdTemp(author, markdown, function (err, newMds){
    if(!err){
      res.json({response : "upload-markdown-success", mdArr : newMds});
    }
  });
});

router.post('/archive-markdown', function (req, res){
  // markdown id
  //roomName, host, get from session
  var roomName = req.session.roomName || "",
      host = req.session.host || "",
      author = req.body.username || "author";

  Meeting.saveMarkdown(roomName, host, author, function (err, result){
    if(!err){
      req.json({response : "archive-markdown-success"});
    }
  });
});

router.post('/upload-img', function (req, res){
  console.log('upload-img request comming');
  var target = {
    roomName : req.session.roomName || 'sbsbsb',
    host : req.session.host || 'sb',
    date : req.session.date || '2014/9/12',
    listName : req.body.request,
    page : req.body.page,
    img : compresser.uncompress(req.body.img),
  };
  // console.log(req.body.img);
  Meeting.saveImg(target, function (err, result){
    if(!err){
      return res.json({response : "upload-success", 
                       objectId : result._id, 
                       imgType: req.body.request});
    } else {
      console.log('upload-failed');
      return res.json({response: 'upload-failed'});
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
  console.log(req.body.objectId);
  var objId = new ObjectID(req.body.objectId);

  Meeting.queryImg(objId, function (err, image){
    if(!err){
      image.img = compresser.compress(image.img);
      return res.json({response : "query-img-success", image : image});
    }
  });
});


module.exports = router;