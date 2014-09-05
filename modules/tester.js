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