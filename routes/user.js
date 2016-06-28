var express = require('express');
var router = express.Router();
var url = require('url');
var qs = require('querystring');
var User = require('../models/user');

router.get('/check', function(req, res, next) {
  var queryUrl = url.parse(req.url).query ;
  var params = qs.parse(queryUrl);
  var name = decodeURIComponent(params.name);
  User.getByName(name, function(err, result){
    if(err != null){
      res.send("error in server !");
    }else{
      if(result == null){
        res.send(true);
      }else{
        res.send(false);
      }
    }
  });

});


module.exports = router;