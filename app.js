const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');

var session  = require('express-session');

const app = express();
var flash = require('connect-flash');
const router = express.Router();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

app.use(flash());

const requests = require('./routes/requests');

app.use(express.static(__dirname + '/src'));

require('./authentication/passport')(passport);

// Initialize cookie sessions
app.use(cookieParser());
app.use(cookieSession({ secret: 'my secret', cookie: { maxAge : 1200000 } }));

app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true
} ));
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(passport.initialize());
app.use(passport.session());

app.use('/users/api', require('./routes/users'));

app.use('/requests/api',requests);


// this should the last router
app.route('/*').get(function(req, res) {
  return res.sendFile(path.join(__dirname, './src/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app;
