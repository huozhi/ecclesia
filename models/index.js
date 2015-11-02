var mongoose = require('mongoose')
var config   = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, function (err) {
  if (err) {
    console.log('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

require('./user');
require('./chart');
require('./topic');
require('./discuss');


exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Chart = mongoose.model('Chart');
exports.Discuss = mongoose.model('Discuss');

