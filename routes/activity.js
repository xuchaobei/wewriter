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

router.post("/", function (req, res, next) {
    var userName = CommonUtil.trim(req.body.name);
    if(userName.length == 0){
        req.flash('message', { message : '笔名不能为空!'});
        res.redirect('/activity');
        return;
    }
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
        activityId : 6
    });


    dbPool.getConnection(function(err, connection) {
        if (err) {
            console.log('record save failed: '+ JSON.stringify(record));
            connection.release();
            return next(err);
        }

        connection.beginTransaction(function (err) {
            if (err) {
                console.log('record save failed: '+ JSON.stringify(record));
                connection.release();
                return next(err);
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
                    console.log('record save failed: '+ JSON.stringify(record));
                    connection.rollback(function () {
                        if(err.message){
                            //req.flash('message',err);
                            //res.redirect('/activity');
                            res.json({'message': err.message});
                        }else{
                            // next(err);
                            res.json({'message': '程序异常，打卡失败'});
                        }
                    });
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                //next(err);
                                res.json({'message': '程序异常，打卡失败'});
                            });
                        }else{
                            //res.redirect('/record/' + encodeURIComponent(userId));
                            res.json({'code':'2000'});
                        }
                    });
                }
                connection.release();
            });
        });
    });
});

module.exports = router;





