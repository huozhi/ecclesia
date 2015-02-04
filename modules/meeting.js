var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;

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

  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true},function(err, db){
    if(err){
      mongodb.close();

      return callback(err, null);
    }
    db.createCollection('Meetings', function(err, collection){
      if(err){
        db.close();

        return callback(err, null);
      }else{
        db.collection('Meetings', {strict : true}, function(err, collection){
          if(err){
            db.close();

            return callback(err, null);
          }

          collection.insert(newMeeting, {safe:true}, function(err, meeting){
            if(err){
              db.close();

              return callback(err, null);
            }else{
              db.close();

              return callback(null, meeting[0]);
            }
          });
        });        
      }
    });   
  });
}

Meeting.queryConference = function(roomName, host, callback){
  // console.log('AAAAAAAAAA');
  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true},function(err, db){
    if(err){
      console.log('open err');
      mongodb.close();
      return callback(err, null);
    }else{
      console.log('collection Meetings');
      db.collection("Meetings",function(err, collection){
        if(err){
          console.log('!Meetings',err);
          db.close();
          return callback(err, null);
        }else{
          console.log('findOne queryConference');
          collection.findOne({roomName:roomName, host:host},function(err, result){
            if(err){
              console.log('!findOne',err);
              db.close();
              return callback(err,null);
            } else {
              db.close();

              console.log('db result',result);
              return callback(null, result);
            }
          });
        }
      });
    }
  })
}

Meeting.queryHistory = function(roomname, host, date, callback){
  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true},function(err, db){
    if(err){
      console.log('open:',err);
      mongodb.close();
      return callback(err, null);
    }else{
      db.collection("Meetings",function(err, collection){
        console.log('Meetings here');
        if(err){
          console.log('collection:',err);
          db.close();
          return callback(err, null);
        }else{
          collection.findOne({roomName:roomname, host:host, date:date},function(err, result){
            console.log('queryHistory empty');
            if(err){
              console.log('find',err);
              db.close();
              return callback(err, null);
            } else {
              console.log('find');
              db.close();

              return callback(null, result);
            }
          });
        }
      });
    }
  })
}

Meeting.addParticipant = function(roomname, host, participant, callback){
  
  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true},function(err, db){
    if(err){
      mongodb.close();

      return callback(err, null);
    }else{
      db.collection('Meetings', {strict:true}, function(err, collection){
        if(err){
          db.close();

          return callback(err, null);
        }else{
          collection.update({roomName: roomname,host:host}, {$push:{"userList": participant}}, function(err, doc){
            if(err){
              db.close();

              return callback(err, null);
            }else{
              db.close();

              if(doc){
                console.log(doc);
                return callback(null, doc);
              }
            }
          });
        }
      });
    }
  });
}

Meeting.saveImg = function saveImg(targetObj, callback){

 MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true}, function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }else{
          db.createCollection('Images', function (err, collection){
            if(err){
              mongodb.close();
              return callback(err);
            }else{
                  db.collection('Images', function(err, collection){
                if(err){
                  mongodb.close();
                  return callback(err);
                }
                var img = {
                  page : targetObj.page,
                  img : targetObj.img,
                }
                collection.insert(img, {safe : true}, function(err, result){
                  if(err){
                    mongodb.close();
                    return callback(err, null);
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

  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true}, function(err, db){
    if(err){
      mongodb.close();
      return callback(err);
    }else{
          db.collection('Meetings', function(err, collection){
            if(err){
              mongodb.close();
              return callback(err);
            }
            if(archiveObj.listName === 'chart'){
              var chartWrapper = {
                range : archiveObj.page,
                id : archiveObj.id,
              };
              collection.update({roomName:archiveObj.roomName, host:archiveObj.host, date:archiveObj.date},{$push:{ChartList : chartWrapper}}, {upsert:true},function(err, result){
                if(err){
                  mongodb.close();
                  return callback(err);
                }
                mongodb.close();
                return callback(err, result);
              });
            }
            if(archiveObj.listName === 'sketch'){
              var sketchWrapper = {
                range : archiveObj.page,
                id : archiveObj.id,
              };
              collection.update({roomName:archiveObj.roomName, host:archiveObj.host, date:archiveObj.date},{$push:{SketchList : sketchWrapper}}, function(err, result){
                if(err){
                  mongodb.close();
                  return callback(err);
                }
                mongodb.close();
                return callback(err, result);
              });
            }
          });
    }
  });

}

Meeting.queryImg = function (imgId, callback){
  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser:true}, function (err ,db){
    if(err){
      db.close();
      return callback(err, null);
    }else{
      db.collection('Images', function (err, collection){
        if(err){
          console.log('queryImg open Images:',err);

          db.close();
          return callback(err,null);
        }
        collection.findOne({_id : imgId}, function(err, result){
          if(err){
            console.log('queryImg:',err);
            db.close();
            return callback(err, null);
          } else {
            //console.log(result);
            db.close();
            return callback(null, result);
          }
        });
      });
    }
  });
};


Meeting.saveMarkdown = function saveMarkdown(roomName, host, author, callback){
  var tempName = roomName + host + "Temp";
  var previewName = roomName + host + "Preview";

  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser : true}, function(err, db){
    if(err){
      db.close();
      return callback(err);
    }else{
      db.collection("MdTemp", function (err, mdCollection){

        if(!err){
          mdCollection.find({roomName : roomName, host: host, username : author}, function(err, tempMds) {
            if (!tempMds) {
              console.log('empty while saving markdowns');
              return callback(null, null);
            }
            tempMds.toArray(function (err, docs){
              if(!err){

                mdCollection.remove({roomName : roomName, host: host, username : author}, {safe : true}, function (err, rmcount){
                  if(err){
                    db.close();
                    return callback(err);
                  }else{
                    // console.log(rmcount);
                  }
                });

                db.collection ("MdPreview", function (err, prevCollection){
                  if(err){
                    db.close();
                    return callback(err);
                  }else{
                    prevCollection.remove({roomName : roomName, host: host, username : author}, {safe:true}, function (err, rmcount){
                      if(!err){
                        //do sth
                      }
                    });
                  }
                }); 
                db.collection('Meetings', function (err, meetingCollection){
                  if(err){
                    db.close();
                    return callback(err);
                  }else{
                    meetingCollection.findOne({roomName:roomName, host:host}, function (err, meeting){
                      if(err){
                        db.close();
                        return callback(err);
                      }else{
                        var mdArr = [];
                        var len = meeting.MarkdownList.length;
                        for (i = 0; i < docs.length; i++){
                          var mdDoc = {
                            range : i+len+1,
                            data : docs[i].splitMd,
                          };

                          mdArr.push(mdDoc);
                        }

                        meetingCollection.update({roomName:roomName, host:host},
                          {$push :{MarkdownList : {$each : mdArr}}},
                          function (err, updateCount){
                            if(!err){
                              db.close();
                              return callback(null, updateCount); 
                            }
                          });
                      }
                    });//end findOne meeting
                  }
                });//end meeting db query
              }         
            });
          });
        }
      });
    }
  });
}

Meeting.saveMdDirect = function (roomName, host, markdowns, callback){
  MongoClient.connect ("mongodb://localhost:27017/ecclesia", {native_parser :true}, function (err, db){
    if(err){
      mongodb.close();
      return callback(err, null);
    }
    db.collection ('Meetings', function (err, meetingCollection){
      if(err){
        db.close();
        return callback(err, null);
      }else{
       meetingCollection.findOne({roomName:roomName, host:host}, function (err, meeting){
          if(err){
            db.close();
            return callback(err);
          }else{
            var mdArr = [];
            var len = meeting.MarkdownList.length;
            for (i = 0; i < markdowns.length; i++){
              var mdDoc = {
                range : i+len+1,
                data : markdowns[i],
              };

              mdArr.push(mdDoc);
            }

            meetingCollection.update({roomName:roomName, host:host},
              {$push :{MarkdownList : {$each : mdArr}}},
              function (err, updateCount){
                if(!err){
                  db.close();
                  return callback(null, mdArr); 
                }
              });
          }
        });//end findOne meeting        
      }
    });
  });
}
Meeting.initMdTemp = function initMdTemp(tempdoc, callback){
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
          db.collection('MdTemp', function(err, collection){
            collection.insert(tempdoc,{safe:true}, function(err, mdtemp){
              if(err){
                mongodb.close();
                return callback(err);
              }
              mongodb.close();
              return callback(err, mdtemp);
            });
          });
        }
      });
    }
  });
}

Meeting.saveMdTemp = function saveMdTemp(roomName, host, author, markdowns, callback){
  
  var objIdArr = []; 
  var tempDocs = [];
  var prev = {
    roomName : roomName,
    host : host,
    username : author,
    preview : markdowns[0],
  };

  var tempName = roomName+host+"Temp";
  mongodb.open(function(err, db){
    if(err){
      mongodb.close();

      return callback(err);
    }else{

      db.createCollection("MdTemp", function(err, collection){

        if(err){
          mongodb.close();

          return callback(err, null);
        }else{
            db.collection("MdTemp", function(err,collection){
            if(err){
              mongodb.close();

              return callback(err, null);
            }else{
              console.log('md length',markdowns.length);
              for(i = 0; i < markdowns.length; i++){
                var newTemp = {
                  roomName : roomName,
                  host : host,
                  username : author,
                  splitMd : markdowns[i], 
                };
                console.log(newTemp);
                tempDocs.push(newTemp);           
              }
//              console.log(tempDocs);
              collection.insert(tempDocs,  function (err, result){
                  if(err){
                    console.log(err);
                    mongodb.close();
                    return callback(err);
                  }else{

                    mongodb.close();
                    return callback(null, result);
                    // if(result){
                    //   result.forEach(function (newmd){
                    //     objIdArr.push(newmd._id);
                    //   });
                    // }
                    // var previewName = roomName + host + "Preview";
                    // // mongodb.close();
                    // Meeting.saveMdPreview("MdPreview", prev, function (err, prevArr){
                    //   if(!err)
                    //     mongodb.close();
                    //     return callback(null, result);
                    // });
                  }
                });              
            }
          });
        }
      });
      
    }
  });
}

Meeting.saveMdPreview = function (previewName, prev, callback){
  mongodb.open(function (err, db){
    if(err){
      mongodb.close();
      return callback(err, null);
    }else{
      // db.createCollection(previewName, function (err, collection){
      //   if(err){
      //     mongodb.close();
      //     return callback(err, null);
      //   }
      db.collection(previewName, function (err, collection){
        if(err){
          mongodb.close();
          return callback(err, null);
        }
        collection.insert(prev, function (err, result){
          if(!err){
            mongodb.close();
            return callback(null, result[0]);
          }
        });
      });
      // });          
    }
  });

}


Meeting.queryMdTemp = function (roomName, host, callback){
  var tempName = roomName+host+"Temp";
  console.log(tempName);
  MongoClient.connect("mongodb://localhost:27017/ecclesia", {native_parser : true}, function (err, db){
    if(err){
      db.close();
      return callback(err, null);
    }else{

     db.collection('MdTemp', function (err, collection){
        if(err){
          db.close();
          return callback(err, null);
        }else{
          collection.find({roomName: roomName, host : host}, function(err, tempMds) {
            if (!tempMds) {
              console.log('queryMdTemp none result');
              return callback(null, null);
            }
            tempMds.toArray(function (err, result){
              if(err){
                db.close();
                return callback(err, null);
              }else{
                db.close();
                return callback(null, result);
              }
            });
          });
        }
      });
    }
  });
}

Meeting.queryMdPreview = function (roomName, host, callback){
  //var previewName = roomName + host + "Preview";
  mongodb.open(function (err, db){
    if(err){
      console.log('aaaa',err);
      mongodb.close();
      return callback(err, null);
    }else{
      console.log('query preview m here');
      db.collection("MdPreview", function (err, collection){
        if(err){
          console.log(err);
          mongodb.close();
          return callback(err, null);
        }
        collection.find({roomName : roomName, host: host}, function(err, result) {
          console.log('find no problem');
          if (err) {
            mongodb.close();
            console.log(err);
            return callback(err, null);
          }
          if (!result || !result.length) {

            console.log('nothing found');
            return callback(null, null);
          }
          console.log(result);
          result.toArray(function (err, prevArr){
            if(err){
              console.log(err);
              mongodb.close();
              return callback(err, null);
            }else{
              console.log('db prevArr', prevArr);
              mongodb.close();
              return callback(null, prevArr);
            }
          });
        });
      });
    }
  });

}