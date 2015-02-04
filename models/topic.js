var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Chart = require('./chart');

var TopicSchema = new Schema({
  title: { type: String },
  impress: [ { type: String } ],
  charts: [ { type: Chart } ]
}, {
  collection: 'Topics'
});

mongoose.model('Topic', TopicSchema);
