var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  accessToken: { type: String },
  discusses: [ { type: ObjectId, ref: 'Discuss' } ]
},{
  collection: 'Users'
});

mongoose.model('User', UserSchema);
