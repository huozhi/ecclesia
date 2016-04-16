var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Chart = require('./chart');

var TopicSchema = new Schema({
  title: { type: String },
  impress: { type: String },
  charts: [ { type: Schema.Types.Mixed  } ]
}, {
  collection: 'Topics'
});

mongoose.model('Topic', TopicSchema);
