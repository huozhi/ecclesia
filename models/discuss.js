var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var DiscussSchema = new Schema({
  room: { type: String },
  date: { type: Date, default: new Date() },
  host: { type: ObjectId, ref: 'User' },
  participants: [ { type: String } ],
  topics: [ { type: ObjectId, ref: 'Topic' } ]
},{
  collection: 'Discusses'
});

mongoose.model('Discuss', DiscussSchema);
