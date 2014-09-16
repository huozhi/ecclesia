var express = require('express');
var router = express.Router();
var Meeting = require('../modules/meeting');
var User = require('../modules/user');
var crypto = require('crypto');

router.get('/', function (req, res) {
  if(req.session.username){
      console.log(req.session.username);
      res.render('home');
  }else{
    res.redirect('/');
  }
})

router.get('/logout', function (req, res) {
  if(req.session.username){
    req.session.destroy(function(err){
        if(!err){
          res.redirect('/');
        }
    });
  }else{
    res.redirect('/');
  }
})

router.post('/join-room', function(req, res){
  var roomname = req.body.roomName;
  var host = req.body.host;
  var username = req.session.username;
  var date = req.session.date;

  req.session.host = host;
  var cryptor = crypto.createHash('sha1');
  var raw = host + roomname + date;
  var roomHash = cryptor.update(raw).digest('hex');

  Meeting.addParticipant (roomname, host, username, function (err, addRe){
    if(!err){
      var conference  = {
        roomName : roomname,
        host : host,
        date : date,
      };
      User.archive(username, conference, function (err, archiveRe){
        if(!err){
          res.json({response : "join-success", roomName : roomname, creator : host, roomHash :roomHash} );
        }
      });
    }
  });
});

router.post('/create-room', function (req, res) {
  // deal with post json data 
  // { request:'create-room' username:'..', roomname:'..' }
  // ... code here
  var resInfo = "";
  if (req.body.roomName === 'undefined'){
    resInfo = "create-failed";
    res.json({response: resInfo});
  }else{
    req.session.roomName = req.body.roomName;
    var date = new Date();
    req.session.date = date.toDateString();
    var  newMeeting = {
      roomName : req.body.roomName,
      date : date.toDateString(),
      host : req.body.username,
      userList : [],
      ChartList:[],
      MarkdownList:[],
      SketchList:[]
    };

    var raw = newMeeting.host + newMeeting.roomName + newMeeting.date;
    var roomHash = cryptor.update(raw).digest('hex');

    Meeting.createRoom(newMeeting, function (err, meeting){
      if(!err){
        resInfo = "create-success";
        res.json({response:resInfo, roomName:meeting.roomName, creater: meeting.host, roomHash : roomHash});
      }
    })

    }
});
module.exports = router;
