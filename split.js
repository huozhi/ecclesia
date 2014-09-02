var fs = require('fs');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var fileString = fs.readFileSync('./example.md', 'utf-8');
var impresses = fileString.split(/\+{6,}/);

console.log(fs.existsSync('impresses'));
if(!fs.existsSync('impresses')){
	console.log('mkdir');
	fs.mkdirSync('impresses');
}


for (i = 0; i < impresses.length; i++){
	fs.openSync('impresses/imp'+i+'.md', 'w');

	fs.writeFile('impresses/imp'+i+'.md', impresses[i], function(err){
		if(err) console.log(err.message);

		else console.log('done');
	});
}
