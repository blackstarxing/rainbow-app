var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

// 微信分享ticket   
var ticket = '';
var ticketline = '';

// var path = 'http://172.16.10.134:80';
var path = 'http://118.190.21.195:28888';
// var path = 'http://www.caihonglive.tv:28888';

function getTicket(){
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1bd2b48c81600e98&secret=635994b64fafacc7e375d6554121fe2d', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            ticketline = new Date().getTime();
        }).fail(function(cont, error) {
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '彩虹直播--可以玩的直播' });
});

router.get('/share/index', function(req, res, next) {
    var liveId = req.query.liveId?req.query.liveId:'';
    var type = req.query.type?req.query.type:'';
    var nowtime = new Date().getTime();
    var page = '';
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
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
        // console.log('ticket',ticket);
        // 欢乐牛牛
        // if(type==1){
            page = 'share/index';
        // }
        res.render(page, {
            title: "我正在彩虹直播与美女「"+JSON.parse(result[0]).object.info.nickname+"」一起玩游戏",
            index: JSON.parse(result[0]).object,
            link:JSON.parse(result[0]).object.info.rtmp.replace(/rtmp:/, "http:").replace(/rtmp/, "hls")+'.m3u8',
            ticket:ticket
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
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/withdraw/index',
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
        res.render('withdrawCash/income', {
            title: "我的收益",
            income: JSON.parse(result[0]).object,
        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

//提现-短信验证码登录
router.get('/withdrawCash/messageLog', function(req, res, next) {
   res.render('withdrawCash/messageLog', { title: '短信登录' });
});
//提现-兑换结果
router.get('/withdrawCash/exchangerst', function(req, res, next) {
   res.render('withdrawCash/exchangerst', { title: '兑换结果' });
});
//提现-收益明细
router.get('/withdrawCash/incomeDetail', function(req, res, next) {
     Thenjs.parallel([function(cont) {
        request({
            uri: path+'/withdraw/giftHistoryList',
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
        res.render('withdrawCash/incomeDetail', {
            title: "收益明细",
            incomeDetail: JSON.parse(result[0]).object,

        });
    }).fail(function(cont, error) {
        console.log(error);
        res.render('error', { title: "错误"});
    });
});


// 活动页路由
router.get('/activity/handline', function(req, res, next) {
   res.render('activity/handline', { title: '我要上头条' });
});

router.get('/activity/recharge', function(req, res, next) {
   res.render('activity/recharge', { title: '充值说明' });
});

router.get('/activity/notice', function(req, res, next) {
   res.render('activity/notice', { title: '文明公约' });
});

// 邀请好友
router.get('/activity/invite', function(req, res, next) {
   res.render('activity/invite', { title: '邀请好友' });
});

module.exports = router;
