'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Chart = new Schema({
  type: { type : String },
  lables: [ { type: String } ],
  values: [ { type: Number } ],
})

module.exports = mongoose.model('Chart', Chart)
