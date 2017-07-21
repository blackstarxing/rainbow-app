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
	    	//支付失败提示
	    	payPrompt:false,
	    	//支付文字
	    	payText:'',
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
        switchCash:function(index,value){
        	var _this = this;
        	_this.isCur = index;
        	_this.firsrAward = value;
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
	                  	var appId = weixinPay.appId+'';
	                  	var nonce_str = weixinPay.nonceStr+'';
	                  	var package = weixinPay.package+'';
	                  	var timeStamp = weixinPay.timeStamp+'';
	                  	var paySign = weixinPay.paySign+'';
	                  	var signType = weixinPay.signType+''; 
	                  	callpay();
		                function onBridgeReady(){  
						    WeixinJSBridge.invoke(  
						        'getBrandWCPayRequest', {  
						             "appId":appId,     //公众号名称，由商户传入  
						             "paySign":paySign,         //微信签名  
						             "timeStamp":timeStamp, //时间戳，自1970年以来的秒数  
						             "nonceStr":nonce_str , //随机串  
						             "package":package,  //预支付交易会话标识  
						             "signType":signType,     //微信签名方式 
						         },  
						         function(res){
                                    for(var i in res){
                                        alert('key:'+i+',value:'+res[i])
                                        if(typeof (res[i])=='object' ){
                                             for(var j in res[i]){
                                                   alert('key:'+j+',value:'+res[i][j])
                                             }
                                        }
                                     }
						          	if(res.err_msg == "get_brand_wcpay_request:ok" ) {  
						           		 window.location.href = '/Recharge/paySuccess';
								    }else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
								        // var _this = this;
                //                         _this.payText = '支付失败'; 
								        // _this.payPrompt = true; 
                //                          setTimeout(function(){
                //                             _this.payPrompt = false; 
                //                      ,2000);
                                        layer.open({
                                          content: '支付失败',
                                          btn: '好的',
                                          shadeClose: false,
                                        });
								    }else if(res.err_msg == "get_brand_wcpay_request:fail" ){  
								        //  var _this = this;
								        // _this.payText = '支付失败'; 
								        // _this.payPrompt = true; 
                //                         setTimeout(function(){
                //                             _this.payPrompt = false; 
                //                         },2000); 
                                        layer.open({
                                          content: '支付失败',
                                          btn: '好的',
                                          shadeClose: false,
                                        });
								    } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。  
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
						};
	                }else if(data.code == -1){
    	                layer.open({
    	                  content: '充值失败',
    	                  btn: '好的',
    	                  shadeClose: false,
    	                });
	                }else if(data.code == -5){
                        layer.open({
                            content: '参数出错',
                            btn: '好的',
                            shadeClose: false,
                        });
                    }else{
                        layer.open({
                            content: '服务器出错,请稍后再试',
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

    }
})
	