var fs = require('fs');

var fileString = fs.readFileSync('./example.md', 'utf-8');
var impresses = fileString.split(/\+{6,}/);

if(!fs.exists('impresses')){
	fs.mkdirSync('impresses');
}


for (i = 0; i < impresses.length; i++){
	fs.openSync('impresses/imp'+i+'.md', 'w');

	fs.writeFile('impresses/imp'+i+'.md', impresses[i], function(err){
		if(err) console.log(err.message);

		else console.log('done');
	});
}
