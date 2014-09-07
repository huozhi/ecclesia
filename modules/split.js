var fs = require('fs');


function split(filepath){
	var fileString = fs.readFileSync(filepath, 'utf-8');
	var impresses = fileString.split(/\+{6,}/);

	console.log(impresses);
}

module.exports = split;