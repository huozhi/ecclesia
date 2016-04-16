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
const debug = require('debug')('ecclesia')

const routes = require('./routes')
const config = require('./config')
const authMiddleware = require('./middlewares/auth')
const controllers = require('./controllers')
const app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.disable('x-powered-by')

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(multer({
  rename: function (fieldname, filename) {
    return util.format('%s-%s', filename, Date.now())
  },
}))

app.use(session({
  secret: config.cookieSecret,
  cookie: { maxAge: 24*60*60*1000 },
  resave: true,
  saveUninitialized: true
}));


app.use(authMiddleware)

app.use(routes);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.log(err);
  if (err) {
    res.send(err.stack);
}
next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.stack);
});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.stack);
});



var server = https.createServer(config.signal.opts, app)
server.listen(config.port || 3000, config.host, () => {
  console.log(`Https server listen on https://${config.host}:${config.port}`)
})


module.exports = app;
