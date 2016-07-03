/**
 * Created by xu on 16/6/1.
 */
var async = require('async');
var dbPool = require('./db');
var Date = require('../utils/date');

function Record(record) {
    this.userId = record.userId;
    this.userName = record.userName;
    this.date = record.date;
    this.title = record.title;
    this.wordCount = record.wordCount;
    this.category = record.category;
}

Record.prototype.save = function save(conn, callback) {
    var record = {
        user_id : this.userId,
        user_name: this.userName,
        date: this.date,
        title: this.title,
        word_count: this.wordCount,
        category: this.category
    };

    async.series([
        function checkRecordOfToday(callback) {
            queryByUserAndDate(record.user_name, record.date, function(err, rows){
                if (rows && rows.length != 0) {
                    var err = { code : 1};   //重复打卡错误
                    callback(err);
                } else {
                    callback(null);
                }
            });
        },
        function insertRecord(callback) {
            insert(conn, record, callback);
        }

    ], function (err, results) {
        if (err) {
            console.error(err);
            callback(err);
            //throw err;
        } else {
            callback(null);
        }
    });
};

function queryByUserAndDate(userName, date, callback){
    dbPool.query('select * from record where user_name = ? and `date` = ? ', [userName, date], callback);
}

function insert(conn, record, callback) {
    conn.query('insert into record set ?', record, callback);
}


module.exports = Record;