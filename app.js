config = require('./config');

var express = require('express');
var app = express();

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.host);

var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));

//Set up sessions in express
/*
 var session = require('express-session');
 var sessionMiddleware = session({
 secret: config.secret,
 resave: false,
 saveUninitialized: true
 });
 app.use(sessionMiddleware);
 */

var flash = require('express-flash');
app.use(flash());

//Initialize passport for local login
/*
 var passport = require('passport');
 app.use(passport.initialize());
 app.use(passport.session());
 require('./auth/control.local.js')(passport);
 */

//Initialize passport for jwt login
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require("./auth/control.jwt")(passport);

var router = express.Router();
app.use(router);

require('./prototypes');
require('./routes/route.main')(router);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./sockets/socket.main')(io);

app.get('/', (req, res) => res.send('API works'));

app.listen(config.port).on('listening', function () {
    console.log('Listening on port ' + config.port)
});