'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Chart = require('./chart')

const Topic = new Schema({
  title: { type: String },
  impress: { type: String },
  charts: [ { type: Schema.Types.Mixed  } ]
}, {
  collection: 'topics'
})

module.exports = mongoose.model('Topic', Topic)
