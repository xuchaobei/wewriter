/**
 * Created by xu on 16/6/1.
 */
var async = require('async');
var dbPool = require('./db');

function Report(report){
    this.userId = report.userId;
    this.userName = report.userName;
    this.continuousCount = report.continuousCount;
    this.totalCount = report.totalCount;
    this.totalWords = report.wordCount;
}

Report.getDefaultByUserId = function getDefaultByUserId(userId, callback){
    dbPool.query('select * from user where user_id = ? ', [userId], function(err, rows){
        if(err){
            callback(err);
        }else if(rows && rows.length > 0){
            var report = new Report({
                userId : userId,
                userName : rows[0].user_name,
                continuousCount : rows[0].continuous_count,
                totalCount : rows[0].total_count,
                wordCount : rows[0].total_words
            });
            callback(null, report);
        }else{
            callback(null);
        }
    });

 /*   async.series({

        continuousCount : function getContinuousCount(callback) {
            var date = new Date().Format('yyyy-MM-dd');
            var count = 0;
            dbPool.query('select * from record where user_name = ? and `date` = ?',[user, date], function(err, rows){
                console.log('count ='+rows);
                //if(rows && rows.length == 1){
                if(rows && rows.length > 0){
                    count = rows[0].continuous_count;
                }
                callback(null, count);
            })
        },
        totalCount: function getTotalCount(callback) {
            var count = 0;
            dbPool.query('select count(*) as total_count from record where user_name = ?',[user], function(err, rows){
                count = rows[0].total_count;
                callback(null, count);
            })
        }
    }
    , function (err, results) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            callback(null, results);
        }
    });*/
};



module.exports = Report;


