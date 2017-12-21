const fs = require('fs')
const util = require('util')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const swig = require('swig')
const multer = require('multer')
const logger = require('morgan')
const passport = require('passport')

const routes = require('./routes')
const config = require('./config')

const controllers = require('./controllers')
const app = express()

swig.setDefaults({cache : app.get('env') === 'production'})
app.set('views', path.join(__dirname, 'views'))
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.disable('x-powered-by')

app.use(favicon(path.join(__dirname, 'static/favicon.ico')))
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(logger('dev'))
app.use(multer({
  rename: (fieldname, filename) => {
    return util.format('%s-%s', filename, Date.now())
  },
}))

app.use(session({
  secret: config.cookieSecret,
  cookie: {maxAge: 24 * 60 * 60 * 1000},
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
require('./strategy')(passport)

app.use('/', routes)
app.use('*', (req, res) => res.sendStatus(404))

var server = https.createServer(config.signal.opts, app)
server.listen(config.port, config.host, () => {
  console.log(`Https server listen on https://${config.host}:${config.port}`)
})

module.exports = app
