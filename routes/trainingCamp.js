var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');
var UserActivity = require('../models/useractivity');
var async = require('async');
var dbPool = require('../models/db');
var CommonUtil = require('../utils/common');

router.get("/", function (req, res, next) {
    Activity.getCurrentTerm(function (err, term) {
      if (err) {
          console.log(err);
          res.json({'message':'程序异常'});
          return;
      }
      res.json({'code':2000, 'term': term});
    })
});

router.post("/register", function (req, res, next) {
    var userId = req.body.user;
    if(!userId) {
        res.json({'message':'无法获取用户ID，请尝试重新打开应用'});
        return;
    }
    Activity.getCurrentTerm(function (err, term) {
      if (err) {
          console.log(err);
          res.json({'message':'程序异常'});
          return;
      }
      UserActivity.checkIfRegistered(userId, term, function(err, ifRegistered){
        if(err) {
          console.log(err);
          res.json({'message':'程序异常'});
          return;
        }
        if(ifRegistered) {
          res.json({'message':'您已经登记过，无需重复登记'});
          return;
        }
        var userActivity = new UserActivity({
            userId : userId,
            activityId : term
        });
        userActivity.save(dbPool, function(err){
            if(err) {
              console.error(err);
              res.json({'message':'程序异常'});
            }else {
              res.json({'code':'2000'});
            }
        })
      });
    });
});

module.exports = router;
