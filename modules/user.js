var mongodb = require('mongodb');

function User(user){
  this.username = user.username;
  this.userPwd = user.password;
  if(user.conferences.length){
   this.conferences = user.conferences;
  }
}

module.exports = User;

User.register = function register(callback){
  var newUser = {
    username : this.username;
    userPwd : this.userPwd;
  };

  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }

    db.collection('Users',{strict : true},  function(err, collecion){
        if(err){
          mongodb.close();
          return callback(err);
        }

        collecton.ensureIndex('username', {unique : true});
        collection.insert(newUser, {safe : true}, function(err, newUser){
          mongodb.close();
          callback(err, newUser);
        });
    });
  });
};

User.get = function get(username, callback){
    mongodb.open(function(err, db){
      if(err){
        return callback(err);
      }

      db.collection('Users', {strict : true}, function(err, collection){
        if(err){
          mongodb.close();
          return callback(err);
        }

        collection.findOne({username : username}, function(err, doc) {
          mongodb.close();

          if(doc){
            var user = new User(doc);
            callback(err, user);
          }else{
            callback(err, null);
          }
        });
      });
    });
};

User.archive = function archive(conference, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('Users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      var username = this.username;
      var conferenceName = conference.name;
      collection.update( {username : name}, {$push : {"conferences" : conferenceName} }, function(err, doc){
        mongodb.close();
        if(doc){
          console.log("update a conference");
          callback(err, doc);        
        }
      });
    });
  });
};