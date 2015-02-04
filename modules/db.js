var DB = require('mongodb').Db;

var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new DB(
	'ecclesia'
	new Server(
      'localhost',
      Connection.DEFAULT_PORT,
      { auto_reconnect:true }
    ), 
	{ safe:true }
); 