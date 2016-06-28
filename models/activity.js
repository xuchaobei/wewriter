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

module.exports = Activity;