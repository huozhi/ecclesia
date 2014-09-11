var mongodb = require('./db');

function User(user){
  this.username = user.username;
  this.userPwd = user.userPwd;
  this.mailbox = user.mailbox;
  if(user.conferences == 'undefined'){
   this.conferences = [];
  }else{
    this.conferences = user.conferences;
  }
}



User.prototype.register = function register(callback){
  var newUser = {
    username : this.username,
    userPwd : this.userPwd,
    mailbox : this.mailbox,
  };

  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }

    db.createCollection('Users', function(err, collecion){
        if(err){
          mongodb.close();
          console.log('create failed');
          return callback(err);
        }
      });
    db.collection('Users', function(err, collection){

        collection.ensureIndex("username", {unique : true}, function(err){
          if(err)
            {
              mongodb.close();
              return callback(err);
            }
        });

        collection.insert(newUser, {safe : true}, function(err, newer){
          if(err){
            mongodb.close(); return callback(err);
          }
          mongodb.close();
          return callback(err, newer);
        });
    });
        
  });
};


User.loginCheck = function(name, pwd, callback){
  var message = null;
  User.get(name, function(err, user){
    if(!err){
      //console.log(user);
      var dbPwd = (user == null)? '' : user.userPwd;
      if( pwd === dbPwd){
        message = true;
        return callback(err, message);
      }
      message = false;
      return callback(err, message);
    }
    return callback(err, null);
  });
}


User.get = function get(username, callback){
    mongodb.open(function(err, db){
      if(err){
        mongodb.close();
        return callback(err);
      }

      db.createCollection('Users', function(err, collecion){
        if(err){
          mongodb.close();
          console.log('no creation');
          return callback(err);
        }else{
            db.collection('Users', {strict : true}, function(err, collection){
              if(err){
                mongodb.close();
                return callback(err);
              }

              collection.findOne({username : username}, function(err, doc) {
                mongodb.close();

                if(doc){
                  var user = new User(doc);
                  return callback(err, user);
                }else{
                  mongodb.close();
                  return callback(err, null);
                }
              });
          });
        }
      });


    });
};

// var conference = {
//   roomName : roomname,
//   host : host,
//   date : date,
// }
User.archive = function archive(username, conference, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    db.collection('Users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }

      //console.log(username+' '+conference.name);
      collection.update( {username : username}, {$push : {"conferences" : conference} }, function(err, doc){
        if(err){
          mongodb.close();
          return callback(err);
        }
        mongodb.close();
        if(doc){
          console.log("update a conference");
          callback(err, doc);        
        }
      });
    });
  });
};

module.exports = User;