var mongodb = require('./db');

function Markdown(markdown){
	this.name = markdown.name;
	this.conference = markdown.conference;
	this.ownerName = markdown.ownerName;
}

module.exports = Markdown;

Markdown.save = function save(callback){
	var markdown = {
		name: this.name;
		conference = this.conference;
		ownerName = this.ownerName;
	};
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('Meetings', {strict:true}, function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}


		});
	});
};