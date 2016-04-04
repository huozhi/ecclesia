'use strict'

const https = require('https')
const config = require('./config')
const sockets = require('./sockets')

const socketServer = https.Server(config.signal.opts, function(req, res) {
  res.writeHead(404)
  res.end()
}).listen(config.signal.port)

sockets(socketServer, config)
