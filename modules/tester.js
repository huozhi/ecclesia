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

newUser1.register(function(err, newuser){
  if(err){
    console.log(err.message);
  }else{
    console.log(newuser[0].username + ' sign up success!');

    newUser2.register(function(err, newuser){
      if(err){
        console.log(err.message);
      }else{
        //console.log(typeof(newuser));
         console.log(newuser[0].username + ' sign up success!');
      }
    });
  }
});
