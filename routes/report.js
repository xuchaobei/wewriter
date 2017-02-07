var express = require('express');
var router = express.Router();
var url = require('url');
var qs = require('querystring');
var record = require('../models/record');

router.get('/', function(req, res, next) {
    res.render('report');
});

router.get('/undone', function(req, res, next) {
    res.render('undone');
});

router.get('/search', function(req, res, next) {
    var queryUrl = url.parse(req.url).query ;
    var params = qs.parse(queryUrl);
    var startDate = params.startDate;
    var endDate = params.endDate;
    var name = decodeURIComponent(params.name);
    var ifMember = params.ifMember;
    record.get(
        {
            startDate: startDate,
            endDate: endDate,
            name: name,
            ifMember: ifMember
        },
        function(err, result){
            if(err){
                return next(err);
            }else{
                res.json(result);
            }
        }
    );

});

router.get('/undonesearch', function(req, res, next) {
    var queryUrl = url.parse(req.url).query ;
    var params = qs.parse(queryUrl);
    var date = params.date;
    record.getUndone(
        {
            date: date
        },
        function(err, result){
            if(err){
                return next(err);
            }else{
                res.json(result);
            }
        }
    );

});

module.exports = router;


