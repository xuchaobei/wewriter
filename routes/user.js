var express = require('express');
var router = express.Router();
var url = require('url');
var qs = require('querystring');
var https = require('https');
var User = require('../models/user');
var setting = require('../setting');

router.get('/check', function(req, res, next) {
  var queryUrl = url.parse(req.url).query ;
  var params = qs.parse(queryUrl);
  var name = decodeURIComponent(params.name);
  User.getByName(name, function(err, result){
    if(err){
      next(err);
    }else{
      if(result == null){
        res.send(true);
      }else{
        res.send(false);
      }
    }
  });
});

router.get('/login', function(req, res, next) {
  var queryUrl = url.parse(req.url).query ;
  var params = qs.parse(queryUrl);
  var code = decodeURIComponent(params.code);

  var options = {
    hostname: 'api.weixin.qq.com',
    path: '/sns/jscode2session?appid='+setting.appid+'&secret='+setting.secret+'&js_code='+code+'&grant_type=authorization_code',
    method: 'GET'
  }
  var request = https.request(options, function(response) {
    response.on('data', function(data) {
      var jsonData = JSON.parse(data);
      if(jsonData.openid) {
        res.send({flag:true, userId: jsonData.openid});
      } else {
        req.log.error('get openid failed: '+ jsonData.errmsg);
        res.send({flag:false});
      }
    });
  });

  request.on('error', function(error) {
    req.log.error(error);
    res.send({flag:false});
  });
  request.end();

});


module.exports = router;
