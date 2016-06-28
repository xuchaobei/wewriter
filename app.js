/**
 * Module dependencies.
 */

var express = require('express')
    , root = require('./routes/index')
    , record = require('./routes/record')
    , user = require('./routes/user')
    , activity =require('./routes/activity')
    , http = require('http')
    , path = require('path')
    , qs = require('querystring')
    , mysql = require('mysql')
    , async = require('async')
    , bodyParser = require('body-parser')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , flash = require('connect-flash')
    , session = require("express-session")
    , cookieParser = require('cookie-parser')
    , compression = require('compression');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(favicon());
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(cookieParser());
/*app.use(session({
    genid: function(req) {
        return new Date();
    },
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized:true
}));*/

app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' }));

if (app.get('env') === 'development') {
    console.log('Using development settings.');
    // app.use(express.errorHandler());
}

if (app.get('env') === 'production') {
    console.log('Using production settings.');
}


function init() {
    app.get('/', root);
    app.get('/activity', root);
    app.use('/record', record);
    app.use('/record/:user', record);
    app.use('/record-activity', activity);
    app.use('/user', user);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
}

init();
