var settings = require('../settings');
var DB = require('mongodb').Db;

var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new DB(
	settings.db, 
	new Server(settings.host, Connection.DEFULT_PORT, auto_reconnect:true), 
	{safe:true}
); 