/**
 * Module dependencies.
 */

var express = require('express')
    , root = require('./routes/index')
    , record = require('./routes/record')
    , user = require('./routes/user')
    , activity =require('./routes/activity')
    , report =require('./routes/report')
    , signup =require('./routes/signup')
    , message =require('./routes/message')
    , trainingCamp = require('./routes/trainingCamp')
    , share = require('./routes/share')
    , http = require('http')
    , https = require('https')
    , fs = require('fs')
    , path = require('path')
    , qs = require('querystring')
    , mysql = require('mysql')
    , async = require('async')
    , bodyParser = require('body-parser')
    , favicon = require('serve-favicon')
    , flash = require('connect-flash')
    , session = require("express-session")
    , compression = require('compression')
    , pino = require('express-pino-logger')({timestamp: function() {return `,"time":${new Date().toISOString()}`}})
    ;

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(pino);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use(cookieParser());
/*app.use(session({
    genid: function(req) {
        return new Date();
    },
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized:true
}));*/

app.use(session({ resave: false,
    saveUninitialized: true,
    secret: 'atom' }));

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
    app.use('/signup', signup);
    app.use('/record', record);
    app.use('/record-activity', activity);
    app.use('/user', user);
    app.use('/report', report);
    app.use('/message', message);
    app.use('/camp', trainingCamp);
    app.use('/share', share);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({'message': err})
    });

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });

    // if(process.env.NODE_ENV !== 'development') {
    //     const options = {
    //         key: fs.readFileSync('/root/cert/214515885180029.key'),
    //         cert: fs.readFileSync('/root/cert/214515885180029.pem'),
    //     };
          
    //     https.createServer(app).listen(443);
    // }
}

init();
