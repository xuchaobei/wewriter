/**
 * Created by xu on 16/6/22.
 */
var async = require('async');
var dbPool = require('./db');

function Activity(activity){
    this.id = activity.id;
    this.activity = activity.activity;
    this.startDate = activity.startDate;
    this.endDate = activity.endDate;
    this.active = activity.active;
}

Activity.getCurrentTerm = function(callback) {
  dbPool.query('select * from activity where active = 1', function(err, rows){
      if(err){
          callback(err);
      }else if(rows && rows.length > 0){
          callback(null, rows[0].activity);
      }else{
          callback(null, 0);
      }
  });
}

module.exports = Activity;
