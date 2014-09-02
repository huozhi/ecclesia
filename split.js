var fs = require('fs');

var fileString = fs.readFileSync('./example.md', 'utf-8');
var impresses = fileString.split(/\+{6,}/);

fs.exists('impresses/', function(isExist){
	if(!isExist){
		console.log('mkdir');
		fs.mkdirSync('impresses/');
	}
});


for (i = 0; i < impresses.length; i++){
	fs.writeFile('impresses/imp'+i+'.md', impresses[i], function(err){
		if(err) console.log(err.message);

		else console.log('done');
	});
}
