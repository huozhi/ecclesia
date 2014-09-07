var mongodb = require('./db');
function Meeting(meeting){
  this.roomName = meeting.roomName;
  this.date = meeting.date;
  this.host = meeting.host;
  this.userList = meeting.userList;
  this.ImpressList = meeting.ImpressList;
};

module.exports = Meeting;

//create a room is equal to creating a meeting
Meeting.createRoom = function createRoom(newMeeting, callback){
  // var newMeeting = {
  //   roomName = this.roomName;
  //   date = this.date;
  //   userList = this.userList;
  //   ImpressList = this.ImpressList;
  // };

  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    db.createCollection('Meetings', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }else{
        db.collection('Meetings', {strict : true}, function(err, collection){
            if(err){
              mongodb.close();
              return callback(err);
            }

            collection.insert(newMeeting, {safe:true}, function(err, meeting){
              if(err){
                mongodb.close();
                return callback(err);
              }else{
                mongodb.close();
                callback(err, meeting);
              }
            });

          });        
      }
    });   
  });
}

Meeting.addParticipant = function(roomname, host, participant, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }else{
      db.collection('Meetings', {strict:true}, function(err, collection){
        if(err){
          mongodb.close();
          return callback(err);
        }else{
          collection.update({roomName: roomname,host:host}, {$push:{"userList": participant}}, function(err, doc){
            if(err){
              mongodb.close();
              return callback(err);
            }else{
              mongodb.close();
              if(doc){
                console.log(doc);
                return callback(err, doc);
              }
            }
          });
        }
      });
    }
  });
}

Meeting.saveMD = function saveMD(rooname, host, markdowns,callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }else{
      db.collection('Meetings',function(err,collecton){
        if(err){
          mongodb.close();
          return callback(err);
        }else{
          collection.update({roomName:rooname,host:host},{"markdowns": markdowns}, function(err,doc){
            if(err){
              mongodb.close();
              return callback(err);
            }else{
              console.log(doc);
            }
          })
        }
      });
    }
  });
}