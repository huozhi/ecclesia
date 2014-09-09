var User = require('./user');

var newUser1 = new User({
  username : 'tomas',
  password : 'itispwd',
  conferences : [],
});

var newUser2 = new User({
  username : 'heale',
  password : 'itispwd',
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
// User.get(newUser2.username,function(err,newUser3){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(newUser3.username);
//   }
// });


//archive tester

// var conference = {
//   name:'world cup',
//   host:'heale',
// };
// User.archive(newUser1.username, conference, function(err, result){
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

var newMeeting = {
  roomName : "9-8",
  date : new Date(),
  host : "dh",
  userList : [],
  ChartList:[],
  MarkdownList:[],
  SketchList:[]
}

// console.log(newMeeting.date);

// Meeting.createRoom(newMeeting, function(err, meeting){
//   if(err){
//     console.log(err.message);
//   }else{
//     console.log(meeting);

//     Meeting.addParticipant(newMeeting.roomName, newMeeting.host,  "Charpser",function(err, result){
//       if(err){
//         console.log(err.message);
//       }else{
//         console.log('add participant.');
//       }
//     });

//     var spliter = require('./split');

//     var file = "./README.md";

//     var markdowns = spliter(file);

//     Meeting.saveMdTemp('9-8', 'dh', 'binladen',markdowns, function(err, re){
//       if(err){
//         console.log(err);
//       }else{
//         //do sth.
//       }
//     });
 //   }
 // });

// add new participant test
// Meeting.addParticipant(newMeeting.roomName, newMeeting.host,  "Pony",function(err, result){
//       if(err){
//         console.log(err.message);
//       }else{
//         console.log('add participant.');
//       }
//     });


// save base64 data

// var fs = require('fs');

// fs.readFile('14.jpg', 'base64', function(err, data){
//   if(!err){
//     //console.log(data);
    
//     var chart = {
//       range : "c1",
//       data : data
//     };
//     Meeting.saveChart('9-8', 'dh', chart, function(err){
//       if(!err)
//         console.log('save chart!');
//     });
//   }
// } );

//save wrapped md test
var spliter = require('./split');

var file = "./example.md";

var markdowns = spliter(file);

var wrappedmd = {
  range : "p1",
  data : markdowns[0]
};

Meeting.saveMarkdown('9-8', 'dh', wrappedmd, function(err, re){
  if(err){
    console.log(err);
  }else{
    //do sth.
  }
});

//save md temp test
// var spliter = require('./split');

// var file = "./example.md";

// var markdowns = spliter(file);

// Meeting.saveMdTemp('9-8', 'dh', 'zawahli',markdowns, function(err, re){
//   if(err){
//     console.log(err);
//   }else{
//     //do sth.
//   }
// });

/************************************************************************/

/*************************/