exports.Render = require('./Render');
exports.Compresser = require('./Compresser');
exports.handleError = function (err, callback) {
  if (err) {
    console.log(err); return callback(err);
  }
};