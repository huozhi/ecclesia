var express = require('express'); 
var router = express.Router();

var Meeting = require('../modules/meeting');  
var spliter = require('../modules/split');
var ObjectID = require('mongodb').ObjectID;
var compresser = require('../modules/compresser.js');


router.get('/', function (req, res) {
  if (!req.session.username) {
    res.redirect('/');
  } else {
    res.render('chat', {
      session: req.session,
      username: req.session.username,
      isHost: req.session.username === req.session.host
    });
  }

});

router.post('/upload-markdown', function (req, res) {
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  var author = req.session.username;
  var roomName = req.session.roomName;
  var host = req.session.host;
  
  // console.log(markdowns);
  // console.log(author, roomName, host);
  Meeting.saveMdTemp(roomName, host, author, markdowns, function (err, newMds){
    if(!err){
      return res.json({response : "upload-markdown-success", mdArr : newMds});
    } else {
      return res.json({response: 'upload-markdown-failed'});
    }
  });
});

router.post('/upload-and-save', function (req, res){
  var t = req.body.text;
  var markdowns = t.split(/\+{6,}/);
  var author = req.session.username;
  var roomName = req.session.roomName;
  var host = req.session.host;

  Meeting.saveMdDirect(roomName, host, markdowns, function (err, result){
    if(err){
      return res.json({response: 'upSave-markdown-failed'});
    }else{
      return res.json({response: 'upSave-markdown-success', mdArr : result});
    }
  })
})

router.post('/query-meeting-markdown', function (req, res){
  var roomName = req.session.roomName;
  var host = req.session.host;

  if (!roomName || !host) {
    res.rendirect('/home');
  }
  console.log('query-meeting-markdown:',roomName,host);
  Meeting.queryConference(roomName, host, function (err, meeting){
    console.log('in query-meeting-markdown');
    if(!err){
      console.log('meeting',meeting);
      if (meeting) {
        console.log('mdlist',meeting.MarkdownList);
        var result = [];
        meeting.MarkdownList.forEach(function (md){
          result.push(md);
        });
        console.log('result',result);
        return res.json({response:"query-markdown-success", mdArr : result});
      } else {
        console.log('query-meeting-md, null');
        return res.json({response:"query-markdown-success", mdArr: null});
      }
    } else {
      console.log('query-metting-md err', err);
      return res.json({response:"query-markdown-success", mdArr: null});
    }
  });
});

router.post('/query-preview-markdown', function (req, res){
  var roomName = req.session.roomName;
  var host = req.session.host;
  // console.log('query-preview-markdown:',roomName,host);
  if (!roomName || !host) {
    console.log('user info error in query-preview-markdown');
    return res.json({response:"query-markdown-success", previewDict: null});
  }
  Meeting.queryMdPreview(roomName, host, function (err, previewDict){
    // console.log('in queryMdPreview');
    if (!err) {
      console.log('previewDict',previewDict || 'undefined');
      if (!previewDict) {
        console.log('!previewDict');
        return res.json({response:"query-markdown-success", previewDict : null});
      }
      if (previewDict.length) {
        console.log('previewDict.length');
        return res.json({response:"query-markdown-success", previewDict : previewDict});
      } else {
        console.log('0 === previewDict.length');
        return res.json({response:"query-markdown-success", previewDict : null});
      }
    } else {
      console.log('wocaonima:',err);
      return res.json({response:'query-markdown-failed', previewDict: null});
    }

  });

})


router.post('/archive-markdown', function (req, res){
  // markdown id
  //roomName, host, get from session
  var roomName = req.session.roomName,
      host = req.session.host,
      author = req.session.username;

  Meeting.saveMarkdown(roomName, host, author, function (err, result){
    if(!err){
      req.json({response : "archive-markdown-success"});
    }
  });
});

router.post('/upload-img', function (req, res){
  console.log('upload-img request comming');
  var target = {
    roomName : req.session.roomName,
    host : req.session.host,
    date : req.session.date,
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

  if (!type || !roomName || !host || !date) {
    console.log('err info in refresh-img');
    return res.json({response : "refresh-success", SketchList : null});
  }
  console.log(type,roomName,host,date);
  Meeting.queryHistory(roomName, host, date, function (err, conference){
    console.log('img, i m here');
    if(!err){
      var resList = [];
      if (!conference || !conference.ChartList.length) {
        return res.json({response: 'refresh-success', ChartList: null});
      }
      if(type === "chart"){
        resList = conference.ChartList;
        console.log('chart type');
        return res.json({response : "refresh-success", ChartList : resList});
      }
      else if(type === "sketch"){
        if (conference.SketchList.length == 0) {
          return res.json({response: 'refresh-success', SketchList: null});
        }
        resList = conference.SketchList;
        console.log('sketch type');
        return res.json({response : "refresh-success", SketchList : resList});
      }
      else {
        console.log('err type');
        return res.json({response: "refresh-failed", SketchList: null});
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

router.post('/query-outline', function (req, res){
  console.log("get outline");

  var roomName = req.session.roomName;
  var host = req.session.host;
  var date = req.session.date;
  Meeting.queryHistory(roomName, host, date function (err, meeting){
    if(err){
      return res.json({response:"query-outline-failed"});
    }else{
      return res.json({response:"query-outline-success", outline: meeting.Outline});
    }
  });
});

module.exports = router;