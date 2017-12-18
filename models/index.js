'use strict'

const mongoose = require('mongoose')
const config   = require('../config')

mongoose.Promise = global.Promise
mongoose.connect(config.db, function (err) {
  if (err) {
    console.log('connect to %s error: ', config.db, err.message)
    process.exit(1)
  }
})

exports.User = require('./user')
exports.Discuss = require('./discuss')
