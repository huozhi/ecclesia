var settings = require('../setting');
var DB = require('mongodb').Db;

var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new DB(
	settings.db, 
	new Server(settings.host, Connection.DEFAULT_PORT, {auto_reconnect:true}), 
	{safe:true}
); 