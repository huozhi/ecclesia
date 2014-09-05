var mongodb = require('./db');

function User(user){
  this.username = user.username;
  this.userPwd = user.password;
  if(user.conferences.length){
   this.conferences = user.conferences;
  }
}



User.prototype.register = function register(callback){
  var newUser = {
    username : this.username,
    userPwd : this.userPwd,
  };

  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      console.log('open failed');
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
          mongodb.close();
          //console.log(typeof(newer));
          return callback(err, newer);
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

module.exports = User;