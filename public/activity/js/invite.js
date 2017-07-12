var invite = new Vue({
  	el: '#invite',
  	delimiters: ['${', '}'],
  	data: {
  		invite:[],
  	},
  	mounted:function(){
  		this.$nextTick(function () {
  			var _this = this;
  			var userId = _this.getQueryString('userId');
  			// var userId = 1000183;
     		$.ajax({
                url: '/webapi/rainbow/invite/reward/list?userId='+userId,
                type: 'get',
                success: function(data) {
                   if(data.code == 0){
                   		_this.invite = data.object;
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
  		});
  	},
  	methods: {
  		//剩余邀请名额弹出框
  		inviteMask:function(){
  			$('.m-invite-mask').show();
				$('body').on('touchmove',function(e){
					e.preventDefault();
			})
		},
		//关闭邀请名额弹出框
		closeMask:function(){
			$('.m-invite-mask').hide();
			$('body').unbind('touchmove');
		},
  		// 立即邀请好友按钮
  		inviteFriend:function(){
  			var shareTitle = '呼朋唤友,相约彩虹';
  			var shareDescription = '一起游戏,一起看美女靓仔精彩直播。'; 
  			var shareImageUrl = 'http://img.wangyuhudong.com/uploads/imgs/live/2017/07/06/70c1e490e23b4a27bbf9e4c11a07f383.png';
  			// 预发布
  			// var shareUrl = 'http://118.190.21.195:3000/activity/friendRegister';
  			var shareUrl = 'http://mobile.caihonglive.tv/activity/friendRegister';
  			window.location.href = "rainbowopen://share?shareUrl="+shareUrl+'&shareTitle='+shareTitle+'&shareDescription='+shareDescription+'&shareImageUrl='+shareImageUrl;
  		},
  		// 领取额外奖励
    	getReward:function(type){
    		var _this = this;
    		var userId = _this.getQueryString('userId');
  			// var userId = 1000183;
    		if(type == 3){
    			$.ajax({
	                url: '/webapi/rainbow/invite/getReward',
	                type: 'get',
	                data:{
	                	type:3,
	                	userId:userId	
	                },
	                success: function(data) {
	                   if(data.code == 0){
	                   		_this.invite.first_reward = 1;
	                   		_this.invite.canGetFirst = 0;
	                   		_this.invite.sweet += 1000;
	                   		// window.location.reload();
	                   }else if(data.code == 1){
	                   		_this.invite.first_reward = 1;
	                   		_this.invite.canGetFirst = 0;
	                   		layer.open({
		                      content: '已经领取',
		                      btn: '好的',
		                      shadeClose: false,
		                    });
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
    		}else if(type == 4){
    			$.ajax({
	                url: '/webapi/rainbow/invite/getReward',
	                type: 'get',
	                data:{
	                	type:4,
	                	userId:userId	
	                },
	                success: function(data) {
	                   if(data.code == 0){
	                   		_this.invite.second_reward = 1;
	                   		_this.invite.canGetSecond = 0;
	                   		_this.invite.sweet += 1500;
	                   		// window.location.reload();
	                   }else if(data.code == 1){
	                  	 	_this.invite.second_reward = 1;
	                   		_this.invite.canGetSecond = 0;
	                   		layer.open({
		                      content: '已经领取',
		                      btn: '好的',
		                      shadeClose: false,
		                    });
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
    		}else if(type == 5){
    			$.ajax({
	                url: '/webapi/rainbow/invite/getReward',
	                type: 'get',
	                data:{
	                	type:5,
	                	userId:userId	
	                },
	                success: function(data) {
	                   if(data.code == 0){
	                   		_this.invite.third_reward = 1;
	                   		_this.invite.canGetThird = 0;
	                   		_this.invite.sweet += 2000;
	                   		// window.location.reload();
	                   }else if(data.code == 1){
	                   		_this.invite.third_reward = 1;
	                   		_this.invite.canGetThird = 0;
	                   		layer.open({
		                      content: '已经领取',
		                      btn: '好的',
		                      shadeClose: false,
		                    });
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
    		}else if(type == 6){
				$.ajax({
	                url: '/webapi/rainbow/invite/getReward',
	                type: 'get',
	                data:{
	                	type:6,
	                	userId:userId	
	                },
	                success: function(data) {
	                   if(data.code == 0){
	                   		_this.invite.fourth_reward = 1;
	                   		_this.invite.canGetFourth = 0;
	                   		_this.invite.sweet += 2500;
	                   		// window.location.reload();
	                   }else if(data.code == 1){
	                   		_this.invite.fourth_reward = 1;
	                   		_this.invite.canGetFourth = 0;
	                   		layer.open({
		                      content: '已经领取',
		                      btn: '好的',
		                      shadeClose: false,
		                    });
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
    		}
    	},
    	// 获取url参数
        getQueryString:function(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
  	}
})