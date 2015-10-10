var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var socketioJwt   = require("socketio-jwt");
var config = require('./config.js');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret', config.secret);

// TODO uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var auth = require('./auth.js')(app);

app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/users')(app, auth));
app.use('/api/products', require('./routes/products.js')(app, auth, io));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(200);
    res.send({
        success: false,
        message: err.message,
        error: app.get('env') == 'development' ? err : {}
    });
});

io.sockets
    .on('connection', socketioJwt.authorize({
        secret: config.secret,
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function(socket) {
        //this socket is authenticated, we are good to handle more events from it.
        if( socket.decoded_token._id ){
            console.log('UI connected [' + socket.decoded_token._id + ']');
        }
    });

var server = http.listen(config.port, function () {
    console.log('#############################################');
    console.log('Server start\'s with "' + (!app.get('env') ? 'default' : app.get('env')) + '" environment');
    console.log('Port ' + server.address().port + ' used for HTTP and WebSockets');
    console.log('#############################################');
});