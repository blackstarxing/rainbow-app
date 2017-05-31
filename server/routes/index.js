var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/share/index', function(req, res, next) {
  res.render('share/index', { title: '直播间' });
});

router.get('/webview/level', function(req, res, next) {
  res.render('webview/level', { title: '我的等级' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'blackstar' });
});

module.exports = router;
