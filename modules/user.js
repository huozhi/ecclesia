var mongodb = require('./db');

function User(user){
  this.username = user.username;
  this.userPwd = user.password;
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
        mongodb.close();
        return callback(err);
      }

      db.createCollection('Users', function(err, collecion){
        if(err){
          mongodb.close();
          console.log('no creation');
          return callback(err);
        }
      });

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
    });
};

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