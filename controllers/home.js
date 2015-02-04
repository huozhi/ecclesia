var express = require('express');
var router = express.Router();
var Disscuss = require('../proxy').Disscuss;
var User = require('../proxy').User;
// var Meeting = require('../modules/meeting');
// var User = require('../modules/user');
// var crypto = require('crypto');


exports.index = function (req, res, next) {
  return res.render('home/home');
}

exports.logout = function (req, res, next) {  
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

exports.createRoom = function (req, res, next) {
  var room = req.body.room,
      host = req.body.host,
      topics = req.body.topics;
      message;

  Disscuss.create(room, host, topics, function (err, newDisscuss) {
    if (err) {
      console.log('create failed\n%s', err);
      res.json({ response: false, message: err });
    }
    message = 'create new discuss success';
    return res.json({ response: true, message: message });
  });
}

exports.joinRoom = function (req, res, next) {
  var discussQuery = {
    room: req.body.room,
    host: req.body.host,
  };
  // find the newest discuss room created by the host
  Disscuss.findDiscussByQuery(
    discussQuery,
    { $sort: { 'date': -1 } },
    function (err, discuss) {
    if (err) {
      res.status(403);
      return res.json({ response: false, message: 'discuss not found'});
    }
    var username = req.session.user || 'nima';
    User.findUserByName(username, function (err, user) {
      if (err) {
        console.log('find user failed\n%s', err);
        return req.json({ response: false, message: err });
      }
      Disscuss.addParticipant(discuss, user, function (err, users) {
        if (err) {
          console.log(err);
          return res.json({ response: false, message: err });
        }
        return res.json({ response: true, room: discuss });
      });
    });
  });
}


function joinRoomOld (req, res, next) {
  var room = req.body.room;
  var host = req.body.host;
  var username = req.session.user;
  var date;


  Meeting.queryConference(room, host, function (err, result){
    if(!err){
      if (!result) {
        return res.json({response: 'join-failed'});
      }
      date = result.date;
      console.log('date',result.date);
      var cryptor = crypto.createHash('sha1');
      var raw = host + room + date;
      var roomHash = cryptor.update(raw).digest('hex');
      console.log('hash',roomHash);
      Meeting.addParticipant (room, host, username, function (err, addRe){
        if(!err) {
          var conference  = {
            room : room,
            host : host,
            date : date,
          };
          // ensure session values
          req.session.room = room;
          req.session.host = host;
          req.session.date = date;
          User.archive(username, conference, function (err, archiveRe){
            if(!err){
              return res.json({
                response: "join-success",
                room: room,
                host: host,
                // roomHash :roomHash
              });
            }
            else {
              console.log(err);
              return res.json({response: 'join-failed'});
            }
          });
        }
      });
    }
  });
}



function createRoomOld (req, res, next) {
  
  var message = "";
  if (req.body.room === undefined){
    message = "create-failed";
    return res.json({response: message});
  }


  req.session.room = req.body.room;
  var outline = req.body.outline;
  var date = new Date();
  req.session.date = date.toDateString();
  var  newMeeting = {
    room : req.body.room,
    date : date.toDateString(),
    host : req.session.user,
    userList : [],
    Outline: outline || [],
    ChartList:[],
    MarkdownList:[],
    SketchList:[]
  };
  var raw = newMeeting.host + newMeeting.room + newMeeting.date;
  var cryptor = crypto.createHash('sha1');
  var roomHash = cryptor.update(raw).digest('hex');
  console.log('create new meeting',newMeeting);

  Meeting.createRoom(newMeeting, function (err, meeting) {
    if(!err){
      message = "create-success";
      req.session.host = req.session.user;
      var conference  = {
          room : req.body.room,
          host : req.session.user,
          date : req.session.date,
        };
      var username = req.session.user || 'nima';
        User.archive(username, conference, function (err, archiveRe){
          if(!err){
            res.json({
              response: "create-success", room: conference.room, host : conference.host, roomHash :roomHash, date: conference.date });
          } else {
            console.log(err);
            res.json({response: 'create-failed'});
          }
        });
    }
    else {
      console.log('create-failed');
      res.json({response: 'create-failed'});        
    }
  });
}
