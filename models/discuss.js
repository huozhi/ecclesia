var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var DiscussSchema = new Schema({
  room: { type: String },
  date: { type: Date, default: Date.now },
  host: { type: ObjectId, ref: 'User' },
  participants: [ { type: ObjectId, ref: 'User' } ],
  topics: [ { type: ObjectId, ref: 'Topic' } ]
},{
  collection: 'Discusses'
});

mongoose.model('Discuss', DiscussSchema);
