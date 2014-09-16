var mongodb = require('./db');

  function Meeting(meeting){
  this.roomName = meeting.roomName;
  this.date = meeting.date;
  this.host = meeting.host;
  this.userList = meeting.userList;
  this.ChartList = (typeof (meeting.ChartList) == 'undefined')? []:meeting.ChartList;
  this.MarkdownList = (typeof (meeting.MarkdownList) == 'undefined')? []:meeting.MarkdownList;
  this.SketchList = (typeof (meeting.SketchList) == 'undefined')? []:meeting.SketchList;
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
                return callback(err, meeting[0]);
              }
            });

          });        
      }
    });   
  });
}

Meeting.queryConference = function(roomname, host, date, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();return callback(err);
    }else{
      db.collection("Meetings",function(err, collection){
        if(err){
          mongodb.close();return callback(err);
        }else{
          collection.findOne({roomName:roomname, host:host, date:date},function(err, result){
            if(err){
              mongodb.close();return callback(err);
            }
            mongodb.close();

            return callback(null, result);
          });
        }
      });
    }
  })
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

Meeting.saveImg = function saveImg(targetObj, callback){

  mongodb.open(function(err, db){
    if(err){
      mongodb.close();return callback(err);
    }else{
          db.createCollection('Images', function (err, collection){
            if(err){
              mongodb.close();return callback(err);
            }else{
                  db.collection('Images', function(err, collection){
                if(err){
                  mongodb.close();return callback(err);
                }
                var img = {
                  page : targetObj.page,
                  img : targetObj.img,
                }
                collection.insert(img, {safe : true}, function(err, result){
                  if(err){
                    mongodb.close();return callback(err, null);
                  }
                  mongodb.close();
                  //return callback(err, result);
                  var archiveObj = {
                    roomName : targetObj.roomName,
                    host : targetObj.host,
                    date : targetObj.date,
                    listName : targetObj.listName,
                    page : targetObj.page,
                    id : result[0]._id,
                  };

                  Meeting.archiveImg(archiveObj, function(err, re){
                    if(!err){
                      return callback(err, result[0]);                      
                    }
                  });

                });
              });
            }
          });         
    }
  });

}

Meeting.archiveImg = function (archiveObj, callback){

  mongodb.open(function(err, db){
    if(err){
      mongodb.close();return callback(err);
    }else{
          db.collection('Meetings', function(err, collection){
            if(err){
              mongodb.close();return callback(err);
            }
            if(archiveObj.listName === 'chart'){
              var chartWrapper = {
                range : archiveObj.page,
                id : archiveObj.id,
              };
              collection.update({roomName:archiveObj.roomName, host:archiveObj.host, date:archiveObj.date},{$push:{ChartList : chartWrapper}}, {upsert:true},function(err, result){
                if(err){
                  mongodb.close();return callback(err);
                }
                mongodb.close();return callback(err, result);
              });
            }
            if(archiveObj.listName === 'sketch'){
              var sketchWrapper = {
                range : archiveObj.page,
                id : archiveObj.id,
              };
              collection.update({roomName:archiveObj.roomName, host:archiveObj.host, date:archiveObj.date},{$push:{SketchList : sketchWrapper}}, function(err, result){
                if(err){
                  mongodb.close();return callback(err);
                }
                mongodb.close();return callback(err, result);
              });
            }
          });
    }
  });

}

Meeting.queryImg = function (imgId, callback){
  mongodb.open(function (err ,db){
    if(err){
      mongodb.close();return callback(err, null);
    }else{
      db.collection('Images', function (err, collection){
        if(err){
          mongodb.close();return callback(err,null);
        }
        collection.findOne({_id : imgId}, function(err, result){
          if(err){
            mongodb.close();return callback(err, null);
          }
          mongodb.close();
          return callback(err, result);
        });
      });
    }
  });
};


Meeting.saveMarkdown = function saveMarkdown(roomname, host, author, callback){
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();return callback(err);
    }else{
      db.collection('MdTemp', function (err, mdCollection){

        if(!err){
          mdCollection.find({author : author}).toArray(function (err, docs){
            if(!err){

              mdCollection.remove({author : author}, {safe : true}, function (err, rmcount){
                if(err){
                  mongodb.close();return callback(err);
                }else{
                  // console.log(rmcount);
                }
              }); 
              db.collection('Meetings', function (err, meetingCollection){
                if(err){
                  mongodb.close();return callback(err);
                }else{
                  meetingCollection.findOne({roomName:roomname, host:host}, function (err, meeting){
                    if(err){
                      mongodb.close();return callback(err);
                    }else{
                      var mdArr = [];
                      var len = meeting.MarkdownList.length;
                      for (i = 0; i < docs.length; i++){
                        var mdDoc = {
                          range : i+len+1,
                          data : docs[i],
                        };

                        mdArr.push(mdDoc);
                      }

                      meetingCollection.update({roomName:roomname, host:host},
                        {$push :{MarkdownList : {$each : mdArr}}},
                        function (err, updateCount){
                          if(!err){
                            mongodb.close();return callback(null, updateCount); 
                          }
                        });
                    }
                  })
                }
              });

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

Meeting.saveMdTemp = function saveMdTemp(author, markdowns,callback){
  
  var objIdArr = []; 
  var tempDocs = [];
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
            db.collection('MdTemp', function(err,collection){
            if(err){
              mongodb.close();
              return callback(err);
            }else{
              console.log(markdowns.length);
              for(i = 0; i < markdowns.length; i++){
                var newTemp = {
                  author : author,
                  upload : markdowns[i],
                };

                tempDocs.push(newTemp);           
              }
//              console.log(tempDocs);
              collection.insert(tempDocs,  function (err, result){
                  if(err){
                    console.log(err);
                    mongodb.close();return callback(err, result);
                  }else{
                    // if(result){
                    //   result.forEach(function (newmd){
                    //     objIdArr.push(newmd._id);
                    //   });
                    // }
                    return callback(null, result);
                  }
                });              
            }
          });
        }
      });
      
    }
  });
}