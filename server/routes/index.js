var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

var path = 'http://172.16.10.3:8080';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/share/index', function(req, res, next) {
  res.render('share/index', { title: '直播间' });
});

router.get('/webview/level', function(req, res, next) {
	var userId = req.query.userId?req.query.userId:'';
	var token = req.query.token?req.query.token:'';
	Thenjs.parallel([function(cont) {
        request({
            uri: path+'/rainbow/myLv?userId='+2+'&token=15f8fef211c945c592e10b7b89a278d9',
            headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
              }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('webview/level', {
            title: "我的等级",
            index: JSON.parse(result[0]).object,
        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'blackstar' });
});
router.get('/activity/notice', function(req, res, next) {
  res.render('activity/notice', { title: '文明公约' });
});

module.exports = router;
