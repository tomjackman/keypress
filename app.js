var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

// import keycloak node.js client adapter
const Keycloak = require('keycloak-connect');
const session = require('express-session');

// require routes
var index = require('./routes/index');
var users = require('./routes/users');
var roles = require('./routes/roles');
var groups = require('./routes/groups');


var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*********************************************************
-> Express Session Configuration.
*********************************************************/

app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });


app.use(keycloak.middleware());

/*********************************************************
-> Express Routes.
*********************************************************/

app.use('/', keycloak.protect(), index);

// Access is limited to a Realm User with a Realm 'admin' Role.
app.use('/users', keycloak.protect('realm:admin'), users);
app.use('/roles', keycloak.protect('realm:admin'), roles);
app.use('/groups', keycloak.protect('realm:admin'), groups);

app.use(keycloak.middleware( { logout: '/'} ));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
