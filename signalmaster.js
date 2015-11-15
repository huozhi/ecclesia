var https = require('https');
var config = require('./config');
var sockets = require('./sockets');


var socketServer = https.Server(config.signal.opts, function(req, res) {
  res.writeHead(404);
  res.end();
}).listen(config.signal.port);

sockets(socketServer, config);
