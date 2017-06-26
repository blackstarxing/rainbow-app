var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

// var path = 'http://172.16.10.3:8080';
var path = 'http://118.190.21.195:28888';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/share/index', function(req, res, next) {
    var liveId = req.query.liveId?req.query.liveId:'';
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/rainbow/liveDetail?liveId='+liveId,
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
        res.render('share/index', {
            title: "直播间",
            index: JSON.parse(result[0]).object,
            link:JSON.parse(result[0]).object.info.rtmp.replace(/rtmp:/, "http:").replace(/rtmp/, "hls")+'.m3u8',
        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/webview/level', function(req, res, next) {
	var userId = req.query.userId?req.query.userId:'';
	var token = req.query.token?req.query.token:'';
	Thenjs.parallel([function(cont) {
        request({
            uri: path+'/rainbow/myLv?userId='+userId+'&token='+token,
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

router.get('/webview/agreement', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/rainbow/compact',
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
        res.render('webview/agreement', {
            title: JSON.parse(result[0]).object.title,
            agree: JSON.parse(result[0]).object,

        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
//提现-登录
router.get('/withdrawCash/login', function(req, res, next) {
   res.render('withdrawCash/login', { title: '请登录' });
});

//提现-我的收益
router.get('/withdrawCash/income', function(req, res, next) {
   res.render('withdrawCash/income', { title: '我的收益' });
});

//提现-短信验证码登录
router.get('/withdrawCash/messageLog', function(req, res, next) {
   res.render('withdrawCash/messageLog', { title: '短信登录' });
});

router.get('/activity/handline', function(req, res, next) {
   res.render('activity/handline', { title: '我要上头条' });
});

router.get('/activity/recharge', function(req, res, next) {
   res.render('activity/recharge', { title: '充值说明' });
});

module.exports = router;
