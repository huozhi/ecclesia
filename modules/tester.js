var User = require('./user');
var Meeting = require('./meeting');

var spliter = require('./split');
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

var newMeeting = {
  roomName : "weekly discuss",
  date : new Date(),
  host : "P.M. Lippman",
  userList : [],
  ImpressList : [],
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


//save markdowns test

var file = "../example.md";

spliter(file);

/************************************************************************/

/*************************/