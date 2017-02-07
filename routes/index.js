var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var err = req.flash('message');
  var message = err.length > 0 ? err[0].message : null;
  res.render('index', {error: message});
});

router.get('/activity', function(req, res, next) {
  var err = req.flash('message');
  var message = err.length > 0 ? err[0].message : null;
  res.render('activity', {error: message});
});

module.exports = router;


