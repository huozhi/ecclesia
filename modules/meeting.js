var mongodb = require('mongodb');

function Meeting(meeting) = {
  this.roomName = meeting.roomName;
  this.date = meeting.date;
  this.userInfo = meeting.userInfo;
  this.ImpressList = meeting.ImpressList;
};

Meeting.cr