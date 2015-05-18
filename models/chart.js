var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ChartSchema = new Schema({
  type: { type : String },
  lables: [ { type: String } ],
  values: [ { type: Number } ],
});

mongoose.model('Chart', ChartSchema);
