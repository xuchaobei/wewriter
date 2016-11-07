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
                    var err = { message : "您今天已经打过卡,不能重复打卡!"};   //重复打卡错误
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
            callback(err);
            //throw err;
        } else {
            callback(null);
        }
    });
};

Record.get = function get(param, callback){
    var sql = "select user_name,title,word_count,convert_tz(`date`, '+00:00', '+08:00') as `date` from record r ";
    var name = param.name;
    var startDate = param.startDate;
    var endDate = param.endDate;
    var ifMember = param.ifMember;

    if(ifMember == 'true'){
        sql = sql + 'join user_activity u where r.user_id = u.user_id and u.activity_id = 3 ';
    }
    if((name && name.length>0)){
        if(ifMember == 'true'){
            sql = sql + "and r.user_name='" +name+ "' ";
        }else{
            sql = sql + "where r.user_name='" +name+ "' ";
        }

    }
    if((startDate&& startDate.length>0)  || (endDate&& endDate.length>0)){
        if(ifMember == 'true' || (name && name.length>0)){
            sql = sql + "and r.date between '" +startDate +"' and '" + endDate+ "'";
        }else{
            sql = sql + "where r.date between '" +startDate +"' and '" + endDate+ "'";
        }
    }

    dbPool.query(sql, callback);

};

function queryByUserAndDate(userName, date, callback){
    dbPool.query('select * from record where user_name = ? and `date` = ? ', [userName, date], callback);
}

function insert(conn, record, callback) {
    conn.query('insert into record set ?', record, callback);
}

Record.getUndone = function(param, callback){
    var date = param.date;
    var sql = "select user_name from `user` u, user_activity ua " +
    "where u.user_id = ua.user_id and ua.activity_id = 3 and ua.user_id not in (select user_id from record where `date`='"+ date +"' )";
    console.log(sql);
    dbPool.query(sql, callback);
}


module.exports = Record;