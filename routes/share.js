var express = require('express');
var path = require('path');
var webshot = require('webshot');
var ejs = require('ejs');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var Report = require('../models/report');
var Share = require('../models/share');
var Date = require('../utils/date');
var webshotOptions = {
  screenSize: {
    width: 375,
    height: 667
  },
  shotSize: {
    width: 375,
    height: 'all'
  },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X)'
    + ' AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  siteType:'html'
};

var router = express.Router();
var PicUrlBase = 'http://qingcheng.ink/microapp/images/share/';

router.get('/', function(req, res, next) {
  return res.render('addShare');
})

router.post('/save', function(req, res, next) {
  var share = new Share(req.body.seq, req.body.image_url, req.body.quote, req.body.author);
  share.save(function(err){
    if(err) {
      res.json({message: err});
    }else {
      res.json({code: 2000});
    }
  })
})

router.get('/picture', function(req, res, next) {
  var queryUrl = url.parse(req.url).query ;
  var params = qs.parse(queryUrl);
  var userId = params.userId;
  var filePath = path.resolve(__dirname,'../public/images/share/'+ userId + '.png');
  if(fs.existsSync(filePath)) {
    var picUrl = PicUrlBase + userId + '.png?ts=' + new Date().getTime();
    res.json({
      code: 2000,
      url: picUrl
    })
  }else {
    res.json({
      message: '您还没有日签生成，请先打卡',
    })
  }
})

router.post('/', function(req, res, next) {
  var userId = req.body.userId;
  Report.getDefaultByUserId(userId, function (err, report) {
    if(err){
        res.json({message : err});
    }else{
        var date = req.body.date;
        var seq = date.split('-')[2];
        seq = seq.indexOf('0') === 0 ? seq.substring(1) : seq ;
        Share.get(seq, function(err, share){
          if(err) {
            res.send({message:'生成日签失败' });
          } else {
            if(!share || !share.quote) {
              res.send({message:'生成日签失败' });
            }
            var sentences = share.quote.replace(/,/g,'，').replace(/[\.。]$/g,'').split('，');
            var length = sentences.length;
            for(var i = 0; i < length; i ++ ) {
              if(i !== length - 1) {
                sentences[i] = sentences[i];
              }
            }
            var templateData = {
              date: date,
              imageUrl: share.image_url,
              sentences: sentences,
              author: share.author,
              nickName: req.body.nickName,
              avatarUrl: req.body.avatarUrl,
              continuousCount: report.continuousCount,
              totalCount: report.totalCount,
              totalWords: report.totalWords,
            }

            parseTemplate(userId, templateData, res);
          }
        })
    }
  });

});

function parseTemplate(userId, data, res) {
  ejs.renderFile(path.resolve(__dirname,'../views/share.ejs'), data, function(err, html){
    if(err) {
      req.log.error(err);
      res.send({message:'生成日签失败' });
      return;
    }
    generatePic(userId, html, res);
  });
}

function generatePic(userId, html, res) {
  webshot(html, path.resolve(__dirname,'../public/images/share/'+ userId + '.png'), webshotOptions, function(err) {
    if(err) {
      req.log.error(err);
      res.send({message:'生成日签失败' });
    } else {
      var picUrl = PicUrlBase + userId + '.png?ts=' + new Date().getTime();
      res.send({code:2000, url: picUrl });
    } 
  })
}

module.exports = router;


