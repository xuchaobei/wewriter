var express = require('express');
var router = express.Router();
var Report = require('../models/report');
var Record = require('../models/record');
var User = require('../models/user');
var base64 = require('base64-url');
var async = require('async');
var dbPool = require('../models/db');
var CommonUtil = require('../utils/common');

router.get("/:user", function (req, res, next) {
    var userId = decodeURIComponent(req.params.user);
    Report.getDefaultByUserId(userId, function (err, report) {
        if(err){
            return next(err);
        }
        res.render('feedback', {report: report});
    });
});

router.post("/", function (req, res, next) {
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
                function(callback){
                    user.save(connection, function (err) {
                        if (err) {
                            callback(err);
                        }else{
                            callback(null);
                        }
                    });
                },

                function (callback) {
                    record.save(connection, function (err) {
                        if (err) {
                            callback(err);
                        }else{
                            callback(null);
                        }
                    });
                }
            ],function (err, results) {
                if (err) {
                    console.log('record save failed: '+ JSON.stringify(record));
                    connection.rollback(function () {
                        if(err.message){
                            req.flash('message',err);
                            res.redirect('/');
                        }else{
                            next(err);
                        }
                    });
                } else {
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                next(err);
                            });
                        }else{
                            res.redirect('/record/' + encodeURIComponent(userId));
                        }
                    });
                }
                connection.release();
            });

        });
    });

});

module.exports = router;





