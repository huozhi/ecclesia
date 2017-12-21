'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const User = new Schema({
  account: {type: String, unique: true},
  password: {type: String},
  email: {type: String},
  discusses: [{type: ObjectId, ref: 'Discuss'}],
},{
  collection: 'users',
})

User.methods.validPassword = function(password) {
  return password === this.password
}

module.exports = mongoose.model('User', User)
