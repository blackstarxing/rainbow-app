var rainbowCandy = new Vue({
    el: '#rainbowCandy',
    delimiters: ['${', '}'],
    data: {
    	//tab当前位置
    	isCur:0,
    	//首充奖励
    	firsrAward:600,
    	userId:'',
    	countInfo:[],
    	rechargeInfo:[],
    },
    mounted:function(){
        this.$nextTick(function () {
            /*去掉iphone手机滑动默认行为*/
	        $('body').on('touchmove', function (event) {
	            event.preventDefault();
	        });
            var _this = this;
            _this.userId = window.localStorage.getItem("userId");
            $.ajax({
                url: '/webapi/pay/myGold?userId='+_this.userId,
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                      withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
                  	 _this.rechargeInfo = data.object;
                  	console.log(_this.rechargeInfo);
                  }else{
                    layer.open({
                      content: '服务器出错',
                      btn: '好的',
                      shadeClose: false,
                    });
                  }
                },  
                error: function() {
                    layer.open({
                      content: '网络异常，请刷新重试',
                      btn: '好的',
                      shadeClose: false,
                    });
                }
            });
            $.ajax({
                url: '/webapi/pay/userInfo?userId='+_this.userId,
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                      withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
                  	_this.countInfo = data.object;
                  }else{
                    layer.open({
                      content: '服务器出错',
                      btn: '好的',
                      shadeClose: false,
                    });
                  }
                },  
                error: function() {
                    layer.open({
                      content: '网络异常，请刷新重试',
                      btn: '好的',
                      shadeClose: false,
                    });
                }
            });
        })
    },
    methods: {
        // 获取url参数
        getQueryString:function(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },  
        //切换账号
        switchCount:function(){
        	window.location.href = '/Recharge/login';
        	window.localStorage.removeItem('userId');
        },
        switchCash:function(index){
        	var _this = this;
        	_this.isCur = index;
        	switch(_this.isCur){
        		case 0:_this.firsrAward = 600; break;
        		case 1:_this.firsrAward = 880; break;
        		case 2:_this.firsrAward = 1080; break;
        		case 3:_this.firsrAward = 1800; break;
        		case 4:_this.firsrAward = 2880; break;
        		case 5:_this.firsrAward = 6980; break;
        	}
        },
        //立即支付
        rechargeCandy:function(){
        	var _this = this;
        	var productId = _this.isCur + 1;
        	$.ajax({
                url: '/webapi/pay/weixinRecharge?userId='+_this.userId+'&productId='+productId,
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                      withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
	                  	var weixinPay = data.object;
	                  	var appId = weixinPay.appId;
	                  	var nonce_str = weixinPay.nonce_str;
	                  	var package = weixinPay.package;
	                  	var timeStamp = weixinPay.timeStamp;
	                  	var paySign = weixinPay.paySign;
	                  	var signType = weixinPay.signType; 
	                  	callpay();
		                function onBridgeReady(){  
						    WeixinJSBridge.invoke(  
						        'getBrandWCPayRequest', {  
						             "appId":appId,     //公众号名称，由商户传入  
						             "paySign":paySign,         //微信签名  
						             "timeStamp":timeStamp, //时间戳，自1970年以来的秒数  
						             "nonceStr":nonceStr , //随机串  
						             "package":packageStr,  //预支付交易会话标识  
						             "signType":signType     //微信签名方式  
						         },  
						         function(res){  
						          if(res.err_msg == "get_brand_wcpay_request:ok" ) {  
						         //window.location.replace("index.html");  
						         alert('支付成功');  
						     }else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
						         alert('支付取消');  
						     }else if(res.err_msg == "get_brand_wcpay_request:fail" ){  
						        alert('支付失败');  
						     } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。  
						         }  
						    );  
						 };  
						function callpay(){  
						    if (typeof WeixinJSBridge == "undefined"){  
						        if( document.addEventListener ){  
						            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);  
						        }else if (document.attachEvent){  
						            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);  
						            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);  
						        }  
						    }else{  
						        onBridgeReady();  
						    }  
						}
	                }else{
	                  layer.open({
	                    content: '服务器出错',
	                    btn: '好的',
	                    shadeClose: false,
	                  });
	                }
                },  
                error: function() {
                    layer.open({
                      content: '网络异常，请刷新重试',
                      btn: '好的',
                      shadeClose: false,
                    });
                }
            });

        },

        // 微信支付
        
    }
})
	