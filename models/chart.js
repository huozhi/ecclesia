var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ChartSchema = new Schema({
  lables: [ { type: String } ],
  values: [ { type: Number } ],
});

mongoose.model('Chart', ChartSchema);
