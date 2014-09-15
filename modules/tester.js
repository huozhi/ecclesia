var User = require('./user');

var newUser1 = new User({
  username : 'tomas',
  userPwd : 'itispwd',
  conferences : [],
});

var newUser2 = new User({
  username : 'heale',
  userPwd : 'itispwd',
  conferences : [],
});

/************************************user module test case******************************/
    //register tester
// newUser1.register(function(err, newuser){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(newuser[0].username + ' sign up success!');

//     newUser2.register(function(err, newuser){
//       if(err){
//         console.log(err.message);
//       }else{
//         //console.log(typeof(newuser));
//          console.log(newuser[0].username + ' sign up success!');
//       }
//     });
//   }
// });

//get user tester
// User.get(newUser1.username,function(err,newUser3){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(newUser3.username);
//   }
// });


//login check test

// var name = 'tomasa',
//     pwd = 'itispwd';

// var re = User.loginCheck(name, pwd, function(err, message){
//   if(!err){
//     console.log(message);
//   }
// });


//archive tester

// var conference = {
//   roomName:'nba',
//   host:'wowo',
//   date : "2014/9/12",
// };
// User.archive("nima", conference, function(err, result){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(result);
//   }
// });

/********************************************************************************/

/*************************meeting module test case*******************************/

// create a new room (meeting)
var Meeting = require('./meeting');
var crypto = require('crypto');

var newMeeting = {
  roomName : "sbsbsb",
  date : "2014/09/12",
  host : "sb",
  userList : [],
  ChartList:[],
  MarkdownList:[],
  SketchList:[]
}

// var cryptor  = crypto.createHash('sha512');
// var rawKey = newMeeting.roomName + newMeeting.host + newMeeting.date;
// newMeeting.roomKey = cryptor.update(rawKey).digest('hex');
// console.log(newMeeting.roomKey);

// console.log(newMeeting.date);

// Meeting.createRoom(newMeeting, function(err, meeting){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(meeting);
//    }
//  });

// find conference test

// Meeting.queryConference("sbsbsb", "sb", "2014/9/12", function(err,result){
//   if(!err){
//     console.log('found!');
//     //console.log(result[0].MarkdownList);
//     mdList = result[0].MarkdownList;
//     for(var i in mdList){
//       console.log(mdList[i]);
//     }
//   }
// })


// add new participant test
// Meeting.addParticipant(newMeeting.roomName, newMeeting.host,  "Pony",function(err, result){
//       if(err){
//         console.log(err.message);
//       }else{
//         console.log('add participant.');
//       }
//     });


// save base64 data

/* var fs = require('fs');

fs.readFile('../test/14.jpg', 'base64', function(err, data){
  if(!err){
    //console.log(data);
    var targetObj = {
      roomName : "sbsbsb",
      host : "sb",
      date : "2014/9/13",
      listName : "SketchList",
      page : 1,
      img : data,
    }
    Meeting.saveImg(targetObj, function(err, result){
      if(!err)
        console.log('save ' + targetObj.listName);

    });
  }
} );*/

// var fs = require('fs');

// fs.readFile('../test/22.jpg', 'base64', function(err, data){
//   if(!err){
//     //console.log(data);
//     var targetObj = {
//       roomName : "sbsbsb",
//       host : "sb",
//       date : "2014/09/12",
//       listName : "SketchList",
//       page : 1,
//       img : data,
//     }
//     Meeting.saveImg(targetObj, function(err, result){
//       if(!err)
//         console.log('save ' + targetObj.listName);

//     });
//   }
// } );

// var ObjectID = require('mongodb').ObjectID;
// var objid = new ObjectID("54140ab79d982a0413769efd");
// Meeting.queryImg(objid, function(err, result){
//           console.log("img" + result);
// });

//save wrapped md test
// var spliter = require('./split');

// var file = "./example.md";

// var markdowns = spliter(file);

// var wrappedmd = {
//   range : 2,
//   data : markdowns[1]
// };

// Meeting.saveMarkdown('sbsbsb', 'sb', wrappedmd, function(err, re){
//   if(err){
//     console.log(err);
//   }else{
//     //do sth.
//   }
// });

//save md temp test
var spliter = require('./split');

var file = "./example.md";

var markdowns = spliter(file);

var mdIdArr = [];
  markdowns.forEach(function (markdown){
    Meeting.saveMdTemp("author", markdown, function (err, result){
      mdIdArr.push(result._id);
    });
});

console.log(mdIdArr);

/***********************************Date test**********************************/

// var date = new Date();
// console.log(date.toDateString());
/*************************/

/*            compress test                    */

// var compress = require('./compresser.js').compress;

// var zip = compress('{"type" : "chart"}');

// var uncompress = require('./compresser.js').uncompress;

// var raw = uncompress(zip);
// console.log(raw);

/***************************************************************/
