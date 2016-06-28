var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var err = req.flash('message');
  console.log('err='+JSON.stringify(err));

  if(err.length && err[0].code == 1){
    err = "您今天已经打过卡,不能重复打卡!";
  }
  res.render('index', {error: err});
});

router.get('/activity', function(req, res, next) {
  var err = req.flash('message');
  console.log('err='+JSON.stringify(err));

  if(err.length && err[0].code == 1){
    err = "您今天已经打过卡,不能重复打卡!";
  }
  res.render('activity', {error: err});
});

module.exports = router;


