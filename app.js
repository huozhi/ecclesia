var express = require('express');
var setting = require('./setting');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes');
var app = express();

var https = require('https');
var fs = require('fs');
var debug = require('debug')('ecclesia');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: setting.cookieSecret,
    cookie: { maxAge: 24*60*60*1000 },
    resave: true,
    saveUninitialized: true

}));

app.use('/', routes.signupRouter);
app.use('/login', routes.signinRouter);
app.use('/home', routes.homeRouter);
app.use('/history', routes.historyRouter);
app.use('/chat', routes.chatRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.render('error');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// module.exports = app;

var privateKey = fs.readFileSync('sslcert/privatekey.pem').toString(),
    certificate = fs.readFileSync('sslcert/certificate.pem').toString(),
    cacert = fs.readFileSync('sslcert/cacert.pem').toString();

var server = https.createServer({key: privateKey, cert: certificate, ca: cacert}, app)
    .listen(3000);

module.exports = app;