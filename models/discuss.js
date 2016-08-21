'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const Discuss = new Schema({
  room: { type: String },
  date: { type: Date, default: new Date() },
  host: { type: ObjectId, ref: 'User' },
  participants: [ { type: String } ],
  topics: [ { type: ObjectId, ref: 'Topic' } ]
},{
  collection: 'discusses'
});


module.exports = mongoose.model('Discuss', Discuss)
