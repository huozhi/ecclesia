'use strict'

const mongoose = require('mongoose')
const config   = require('../config')

mongoose.Promise = global.Promise
mongoose.connect(config.db, {useMongoClient: true})

exports.User = require('./user')
exports.Discuss = require('./discuss')
