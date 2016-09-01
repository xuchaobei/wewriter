/**
 * Created by xu on 16/6/22.
 */

var async = require('async');
var dbPool = require('./db');

function UserActivity(ua){
    this.userId = ua.userId;
    this.activityId = ua.activityId;
}

UserActivity.prototype.save = function(conn, callback){
    var that = this;
    query(that.userId, that.activityId, function(err, rows){
        if(err){
            callback(err);
        }else{
            if(rows.length == 0){
                var userActivity = {
                    user_id : that.userId,
                    activity_id : that.activityId
                };
                insert(conn, userActivity, callback);
            }else{
                //若记录存在,忽略此次请求
                callback(null);
            }
        }
    });
};

function query(userId, activityId, callback){
    dbPool.query("select * from user_activity where user_id = ? and activity_id = ?", [userId, activityId], callback);
}

function insert( conn, userActivity, callback) {
    conn.query('insert into user_activity set ?', userActivity, callback);
}

module.exports = UserActivity;