var mongodb = require('./db');
function Meeting(meeting) = {
  this.roomName = meeting.roomName;
  this.date = meeting.date;
  this.userList = meeting.userList;
  this.ImpressList = meeting.ImpressList;
};

module.exports = Meeting;

Meeting.createRoom = function createRoom(callback){
  var newMeeting = {
    roomName = this.roomName;
    date = this.date;
    userList = this.userList;
  };

  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }

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
  });
}