var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var pjax = require('express-pjax-redirect');
var swig = require('swig');
var debug = require('debug')('ecclesia');

var routes = require('./routes');
var config = require('./config');
var middlewares = require('./middlewares');
var controllers = require('./controllers');
var app = express();


// env
app.set('env', 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.cookieSecret,
  cookie: { maxAge: 24*60*60*1000 },
  resave: true,
  saveUninitialized: true
}));

app.use(pjax());
// app.use(middlewares.auth);

app.use(routes.webroutes);

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


var privateKey = fs.readFileSync('sslcert/privatekey.pem').toString(),
certificate = fs.readFileSync('sslcert/certificate.pem').toString(),
cacert = fs.readFileSync('sslcert/cacert.pem').toString();

var opts = {key: privateKey, cert: certificate, ca: cacert};
var server = https.createServer(opts, app);

var io = require('socket.io').listen(server);
require('./signaling')(io);


server.listen(config.port || 3000);


module.exports = app;