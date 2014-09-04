var fs = require('fs');
var mongo = require('mongodb');
var monk = require('monk');
//var mongoose = require('mongoose');

var db = monk('localhost:27017/nodetest1');
//var db2 = mongoose.connect("mongod://localhost/nodetest2");

var fileString = fs.readFileSync('./example.md', 'utf-8');
var impresses = fileString.split(/\+{6,}/);

console.log(fs.existsSync('impresses'));
if(!fs.existsSync('impresses')){
	console.log('mkdir');
	fs.mkdirSync('impresses');
}

var impressCollection = db.get('usercollection');
impressCollection.remove({});

var id = new Number(711);
for (i = 0; i < impresses.length; i++,id++){
	fs.openSync('impresses/imp'+i+'.md', 'w');

	fs.writeFile('impresses/imp'+i+'.md', impresses[i], function(err){
		if(err) console.log(err.message);

		else console.log('done');
	});

	var impName = 'imp'+i;
	var userName = 'user'+id.toString();
	var doc = {};
	doc[impName] = impresses[i];
	doc['userName'] = userName;
	impressCollection.insert(doc, function(err, doc){
		if(err) throw err;
	});

	impressCollection.find({}, function(err, docs){
		//console.log(docs);
	});
}
