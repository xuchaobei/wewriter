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
            callback("无数据");
        }
    });
};



module.exports = Report;


