/**
 * Created by xu on 16/6/1.
 */

var async = require('async');
var dbPool = require('./db');
var Date = require('../utils/date');

function User(user){
    this.userId = user.userId;
    this.userName = user.userName;
    this.continuousCount = user.continuousCount ? user.continuousCount : 1;
    this.totalCount = user.totalCount ? user.totalCount : 1;
    this.totalWords = user.totalWords ? user.totalWords : 0;
    this.date = user.date ? user.date : new Date().Format('yyyy-MM-dd');
    this.remark = '';
};

module.exports = User;

User.prototype.save = function save(conn, callback){
    var userId = this.userId;
    var user = {
        user_id : this.userId,
        user_name : this.userName,
        continuous_count : this.continuousCount,
        total_count : this.totalCount,
        total_words : this.totalWords,
        date : this.date
    };
    var userFromDB = null ;
    async.series([
        function checkUserExist(callback) {
            queryById( userId, function(err, user){
                if(err){
                    callback(err);
                }else{
                    userFromDB = user;
                    callback(null);
                }
            });
        },
        function insertUser(callback) {
            if (userFromDB != null) {
                callback(null);
            } else {
                insert(conn, user, callback);
            }
        },
        function updateUser(callback) {
            if (userFromDB == null){
                callback(null);
            } else{
                var date = new Date(user.date);
                userFromDB.date = new Date(userFromDB.date).Format('yyyy-MM-dd');
                date.setDate(date.getDate() - 1);
                date = new Date(date).Format('yyyy-MM-dd');
                /* 简化处理逻辑: 只要前一个打卡日期是当前打卡日期的上一天,就认为是连续打卡 */
                if(date == userFromDB.date){
                    userFromDB.continuous_count = userFromDB.continuous_count+1;
                }else{
                    userFromDB.continuous_count = 1;
                }
                userFromDB.total_count = userFromDB.total_count + 1;
                userFromDB.total_words = parseInt(userFromDB.total_words) + parseInt(user.total_words);
                var sql = 'update user set continuous_count = ? , total_count = ? , total_words = ?, `date` = ? ' +
                    'where user_id = ?';
                var params = [userFromDB.continuous_count, userFromDB.total_count, userFromDB.total_words, user.date, userFromDB.user_id];
                conn.query( sql, params, callback);
            }
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

User.get = function get(userId,callback){
    queryById(userId, callback);
};

User.getByName = function get(userName,callback){
    queryByName(userName, callback);
};

function queryById(userId, callback){
    dbPool.query('select * from user where user_id = ? ',[userId], function(err, rows){
        if(err){
            callback(err);
        }else{
            var user = null ;
            if(rows && rows.length > 0){
                user = rows[0];
            }
            callback(null, user);
        }
    });
}

function queryByName(userName, callback){
    dbPool.query('select * from user where user_name = ? ',[userName], function(err, rows){
        if(err){
            callback(err);
        }else{
            var user = null ;
            if(rows && rows.length > 0){
                user = rows[0];
            }
            callback(null, user);
        }
    });
}

function insert(conn, user, callback) {
    conn.query('insert into user set ?', user, callback);
}
