var express = require('express');
var router = express.Router();
var Report = require('../models/report');
var Record = require('../models/record');
var User = require('../models/user');
var UserActivity = require('../models/useractivity');
var base64 = require('base64-url');
var async = require('async');
var dbPool = require('../models/db');
var CommonUtil = require('../utils/common');

router.get("/:user", function (req, res) {
    var userId = decodeURIComponent(req.params.user);
    Report.getDefaultByUserId(userId, function (err, report) {
        res.render('feedback', {report: report});
    });
});

router.post("/", function (req, res) {
    var userName = CommonUtil.trim(req.body.name);
    var userId = base64.encode(userName);
    var record = new Record({
        userId: userId,
        userName: userName,
        date: req.body.date,
        title: CommonUtil.trim(req.body.title),
        wordCount: CommonUtil.trim(req.body.word_count)

    });

    var user = new User({
       userId : userId,
       userName : userName,
       date: req.body.date,
       totalWords: CommonUtil.trim(req.body.word_count)
    });

    var userActivity = new UserActivity({
        userId : userId,
        activityId : 1
    });


    dbPool.getConnection(function(err, connection) {
        if (err) {
            console.log('record save failed');
            req.flash('message', err);
            return res.redirect('/activity');
        }

        connection.beginTransaction(function (err) {
            if (err) {
                throw err;
            }

            async.series([
                function (callback) {
                    user.save(connection, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    userActivity.save(connection, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    })
                },
                function (callback) {
                    record.save(connection, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function (err, results) {
                if (err) {
                    console.log('record save failed');
                    req.flash('message', err);
                    connection.rollback();
                    return res.redirect('/activity');
                } else {
                    console.log('record save success');
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        }
                        res.redirect('/record/' + encodeURIComponent(userId));
                    });
                }
                connection.release();
            });
        });
    });
});

module.exports = router;





