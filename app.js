var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var hbs          = require('hbs');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var moment = require('moment');

var map     = require('./routes/map');
var post    = require('./routes/post');
var login   = require('./routes/login');
var profile = require('./routes/profile');
var home    = require('./routes/home');
var help    = require('./routes/help');
var users   = require('./routes/users');
var api     = require('./routes/api');

var helpers = require('./helper/data.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb'}));
app.use(expressValidator({
    customValidators: {
        isNewUser: function (username) {
            return (typeof helpers.getUser(username) === "undefined");
        },
        isUserExists: function (username) {
            return (typeof helpers.getUser(username) !== "undefined");
        },
        loginSuccess: function (username, password) {
            console.log('inside loginSuccess');
            if (helpers.getUser(username)) {
                return helpers.getUser(username).password === password;
            } else {
                return false;
            }
        }
    }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(expressSession({secret: 'youcantseethis', saveUninitialized: false, resave: false}));
/** resave true if you want to save information after each request */

hbs.registerHelper({
    json: function(context) {
        return JSON.stringify(context);
    },
    toLocalTime: function(time) {
        // NOTE: this is not right, server time zone should not be used by client
        console.log('time : ' + moment(time).format('LLL'));
        return moment(time).local().startOf('hour').fromNow();
    }
});

app.use('/'        , login);
app.use('/login'   , login);
app.use('/profile' , profile);
app.use('/home'    , home);
app.use('/help'    , help);
app.use('/post'    , post);

app.use('/map'     , map);
app.use('/users'   , users);
app.use('/api'     , api);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 NOT FOUND');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
