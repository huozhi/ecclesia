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

  //need to init a Mdtemp for using later

  var mdTempdoc = {
    roomName:newMeeting.roomName,
    host:newMeeting.host,
    markdowns:[]
  };

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
                Meeting.initMdTemp(mdTempdoc, function(err){
                  if(!err)
                    callback(err, meeting);
                });
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

Meeting.initMdTemp = function initMdTemp(tempdoc, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();return callback(err);
    }else{
      db.createCollection('MdTemp', function(err, collection){
        if(err){
          mongodb.close();return callback(err);
        }else{
          db.collection('MdTemp', function(err, collection){
            collection.insert(tempdoc,{safe:true}, function(err, mdtemp){
              if(err){
                mongodb.close();return callback(err);
              }
              mongodb.close();return callback(err, mdtemp);
            });
          });
        }
      });
    }
  });
}

Meeting.saveMdTemp = function saveMdTemp(rooname, host, author, markdowns,callback){ 
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }else{

      db.createCollection('MdTemp', function(err, collection){

        if(err){
          mongodb.close();
          return callback(err);
        }else{
            db.collection('MdTemp',function(err,collection){
            if(err){
              mongodb.close();
              return callback(err);
            }else{
                collection.ensureIndex({"markdowns.author":1},{unique:true},function(err){
                  if(err){
                    mongodb.close();
                    return callback(err);
                  }
                });
                var newmdtemp = {
                  author:author,
                  upload:markdowns
                }
                collection.update(
                  {'roomName':rooname,'host':host},
                  {$push : {"markdowns":newmdtemp}}, //找到时候匹配同一个人的全部多个upload[]
                  {upsert: true}, 
                  function(err,doc){
                  if(err){
                    mongodb.close();
                    return callback(err);
                  }else{
                    mongodb.close();
                    console.log(doc);
                  }
              });
            }
          });
        }
      });
      
    }
  });
}