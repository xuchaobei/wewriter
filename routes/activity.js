var express = require('express');
var router = express.Router();
var Report = require('../models/report');
var Record = require('../models/record');
var User = require('../models/user');
var UserActivity = require('../models/useractivity');
var base64 = require('base64-url');
var async = require('async');

router.get("/:user", function (req, res) {
    var userId = decodeURIComponent(req.params.user);
    Report.getDefaultByUserId(userId, function (err, report) {
        res.render('feedback', {report: report});
    });
});

router.post("/", function (req, res) {
    var userId = base64.encode(req.body.name);
    var record = new Record({
        userId: userId,
        userName: req.body.name,
        date: req.body.date,
        title: req.body.title,
        wordCount: req.body.word_count

    });

    var user = new User({
       userId : userId,
       userName : req.body.name,
       date: req.body.date,
       totalWords: req.body.word_count
    });

    var userActivity = new UserActivity({
        userId : userId,
        activityId : 1
    });
    async.series([
        function(callback){
            user.save(function (err) {
                if (err) {
                    callback(err);
                }else{
                    callback(null);
                }
            });
        },
        function(callback) {
            userActivity.save(function(err){
                if(err){
                    callback(err);
                }else{
                    callback(null);
                }
            })
        },
        function (callback) {
            record.save(function (err) {
                if (err) {
                    callback(err);
                }else{
                    callback(null);
                }
            });
        }
    ],function (err, results) {
        if (err) {
            console.log('record save failed');
            req.flash('message',err);
            return res.redirect('/');
        } else {
            console.log('record save success');
            res.redirect('/record/' + encodeURIComponent(userId));
        }
    });

});

module.exports = router;





