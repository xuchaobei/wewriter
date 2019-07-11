var express = require('express');
var router = express.Router();
var CommonUtil = require('../utils/common');
var User = require('../models/user');
var UserActivity = require('../models/useractivity');
var base64 = require('base64-url');
var dbPool = require('../models/db');

router.get('/', function(req, res, next) {
  var err = req.flash('message');
  var message = err.length > 0 ? err[0].message : null;
  res.render('signup', {error: message});
});

router.post('/', function(req, res, next) {
  var userName = CommonUtil.trim(req.body.name);
  var exsited = req.body.existed;

  if(userName.length == 0){
    req.flash('message', { message : '笔名不能为空!'});
    res.redirect('/signup');
    return;
  }
  var userId = base64.encode(userName);
  var userActivity = new UserActivity({
    userId : userId,
    activityId : 4
  });
  if(exsited === "false"){
    User.getByName(userName, function(err, result){
      if(err){
        next(err);
      }else{
        //用户名未被占用
        if(result == null){
          saveUserActivity(userActivity, res, next);
        }else{
          req.flash('message', { message : '该笔名已被占用!'});
          res.redirect('/signup');
        }
      }
    });
  }else{
    saveUserActivity(userActivity, res, next);
  }
});

function saveUserActivity(userActivity, res, next){
  dbPool.getConnection(function(err, connection){
    if (err) {
      req.log.error(err);
      connection.release();
      return next(err);
    }

    userActivity.save(connection, function (err) {
      if (err) {
        req.log.error(err);
        connection.release();
        return next(err);
      } else {
        res.redirect('/message');
        connection.release();
      }
    })
  });
}

module.exports = router;


