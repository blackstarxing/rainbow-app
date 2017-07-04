var vm = window.rainbow;

var last_time_top = null;

var giftTopTime = null;

var last_time_bottom = null;

var giftBottomTime = null

var gname1 = '';

var gname2 = '';

// 视频播放
var ua = navigator.userAgent.toLowerCase();
var myVideo = document.getElementById('mainvideo');
$('.play-btn').click(function(){
    myVideo.play();
    $(this).hide();
})
if(ua.match(/MicroMessenger/i)=="micromessenger"){

}else if(ua.match(/QQ/i) == "qq"){
	myVideo.onplaying = function(){
		$('.play-btn').hide();
	}
}
myVideo.onended = function() {
    // alert("直播结束");
};


// 获取游客云信账号
$.ajax({
    method: "GET",
    url: "/webapi/rainbow/mobile/visitor",
    dataType: 'json',
    success: function(data) {
        vm.live_account = data.object.accid;
		vm.live_token = data.object.token;
		enterLiveroom();
    },
    error: function(a, b, c) {
        console.log("接口出问题啦");
    }
});

// 比较对象是否相等
function isObjectValueEqual(a, b) {
    if(typeof a == 'number' && typeof b == 'number'){
        return a == b
    }
 
 
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
 
    if (aProps.length != bProps.length) {
        return false;
    }
 
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if(Object.prototype.toString(a[propName]) == '[Object Object]'||Object.prototype.toString(b[propName]) == '[Object Object]'){
            isObjectValueEqual(a[propName],b[propName])
        }
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

// 礼物连击动画
function giftCombo(obj,num){
	gname1 = {
		sender_icon:vm.gift_info1.sender_icon,
        sender_name:vm.gift_info1.sender_name,
        gift_name:vm.gift_info1.gift_name,
        gift_icon:vm.gift_info1.gift_icon
	};
	gname2 = {
		sender_icon:vm.gift_info2.sender_icon,
        sender_name:vm.gift_info2.sender_name,
        gift_name:vm.gift_info2.gift_name,
        gift_icon:vm.gift_info2.gift_icon
	}
	// console.log(1,obj);
	// console.log(2,gname1);
	if(isObjectValueEqual(gname1, obj)){
		var now_time_top = new Date().getTime();
		clearTimeout(giftTopTime);
		last_time_top = now_time_top;
		vm.gift_num_top = num;
		$('.wrap-top .gift-num').removeClass('animated bounceIn').addClass('animated bounceIn');
		giftTopTime=setTimeout(function(){
			vm.gift_info1 = '';
			vm.gift_num_top = 1;
			$('.wrap-top').removeClass('slideInLeft').addClass('animated slideOutLeft');
		},5000);
	}else if(isObjectValueEqual(gname2, obj)){
		var now_time_bottom = new Date().getTime();
		clearTimeout(giftBottomTime);
		last_time_bottom = now_time_bottom;
		vm.gift_num_bottom = num;
		$('.wrap-bottom .gift-num').removeClass('bounceIn').addClass('animated bounceIn');
		giftBottomTime=setTimeout(function(){
			vm.gift_info2 = '';
			vm.gift_num_bottom = 1;
			$('.wrap-bottom').removeClass('slideInLeft').addClass('animated slideOutLeft');
		},5000);
	}else if(vm.gift_info1==''){
		var now_time_top = new Date().getTime();
		vm.gift_info1 = obj;
		vm.gift_num_top = num;
		$('.wrap-top').removeClass('slideOutLeft').addClass('animated slideInLeft');
		last_time_top = now_time_top;
		giftTopTime=setTimeout(function(){
			vm.gift_info1 = '';
			vm.gift_num_top = 1;
			$('.wrap-top').removeClass('slideInLeft').addClass('animated slideOutLeft');
		},5000);
	}else if(vm.gift_info2==''){
		var now_time_bottom = new Date().getTime();
		vm.gift_info2 = obj;
		vm.gift_num_bottom = num;
		$('.wrap-bottom').removeClass('slideOutLeft').addClass('animated slideInLeft');
	    last_time_bottom = now_time_bottom;
	    giftBottomTime=setTimeout(function(){
			vm.gift_info2 = '';
			vm.gift_num_bottom = 1;
			$('.wrap-bottom').removeClass('slideInLeft').addClass('animated slideOutLeft');
		},5000);
	}else{

	}
}

// 获取用户卡片信息
$('#room').on('click','.icon-toplist',function(){
    var that = this;
    $.ajax({
        method: "GET",
        url: "/api/rainbow/userInfo",
        dataType: 'json',
        data: {
            otherId:$(that).attr('data-id'),
            // userId:2
        },
        success: function(data) {
            vm.cardInfo = data.object;
        },
        error: function(a, b, c) {
            console.log("接口出问题啦");
        }
    });
    vm.cardDisplay = true;
})

// 进入直播间
function enterLiveroom(){
	var address=[];
	var lct = document.getElementById('chat');
	// 当前时间
	var myDate = new Date(),
		y = myDate.getFullYear(),   //获取完整的年份(4位,1970-????)
		m = myDate.getMonth()+1,      //获取当前月份(0-11,0代表1月)
		d = myDate.getDate(),       //获取当前日(1-31)
		h = myDate.getHours(),      //获取当前小时数(0-23)
		mi = myDate.getMinutes(),    //获取当前分钟数(0-59)
		s = myDate.getSeconds();   //获取当前秒数(0-59)
	// var CurTime = Date.UTC(y,m,d,h,mi,s);Math.round(new Date().getTime()/1000)
	var CurTime = Math.round(new Date().getTime()/1000);
	var shaObj = new jsSHA("SHA-1", "TEXT");
	// AppSecret
	shaObj.update('0e41a6ff0d90'+1+CurTime);
	var hash = shaObj.getHash("HEX");


	// 获取聊天室信息重要参数
	var appKey = '76f43ad5b2a8603c628889449e72e3e7';

	$.ajax({
	    url: "https://api.netease.im/nimserver/chatroom/requestAddr.action",
	    contentType:"application/x-www-form-urlencoded;charset=utf-8",
	    type: 'POST',
	    beforeSend: function (req) {
	        req.setRequestHeader('appkey', appKey);
	        req.setRequestHeader('Nonce',1);
	        req.setRequestHeader('CurTime',CurTime);
	        req.setRequestHeader('CheckSum',hash);
	    },
	    data:{roomid:vm.roomid,accid:vm.accid}
	}).done(function(data) {
	    if(data.code===200){
	       address = data.addr;
	       getChat();
	    }else{
	        // alert("获取连接房间地址失败");
	        $('#chat').append("<div>获取连接房间地址失败!<div>"); 
	    }   
	})
	function getChat(){
		rainbowchatroom = Chatroom.getInstance({
		    appKey: appKey,
		    account: vm.live_account,
		    token: vm.live_token,
		    chatroomId: vm.roomid,
		    chatroomAddresses: address,
	        onconnect: onChatroomConnect,
		    onerror: onChatroomError,
		    onwillreconnect: onChatroomWillReconnect,
		    ondisconnect: onChatroomDisconnect,
		    // 消息
		    onmsgs: onChatroomMsgs
		});
		
	}

	// 更新观众列表
	function getMembers(){
		rainbowchatroom.getChatroomMembers({
		    guest: true,
		    limit: 100,
		    done: getChatroomMembersDone
		});
		function getChatroomMembersDone(error, obj) {
			vm.audienceList = [];
		    console.log('获取聊天室成员' + (!error?'成功':'失败'), error, obj.members);
		    console.log(vm.audienceList);
		    // obj.members = obj.members.slice(1);
		    obj.members.forEach(function(e,index){
		    	// 预发布
		    	var userId = e.account.slice(5);
		    	// var userId = e.account;
		    	if(e.avatar){
		    		vm.audienceList.push({'icon':e.avatar,'userId':userId}); 
		    	}                
            }) 
		}
	}


	function onChatroomConnect(chatroom) {
	    console.log('进入聊天室', chatroom);
	    getMembers();
	    $('#chat').append("<div><span class='message fc-cf'>温馨提示：彩虹的直播互动仅供娱乐，请大家文明观看直播，理性参与游戏，适度娱乐，如有发现相关违规行为，请联系官方客服举报。查证属实的，彩虹将给予奖励。</span></div>"); 
	}
	function onChatroomWillReconnect(obj) {
	    // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
	    console.log('即将重连', obj);
	}
	function onChatroomDisconnect(error) {
	    // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
	    console.log('连接断开', error);
	    if (error) {
	        switch (error.code) {
	        // 账号或者密码错误, 请跳转到登录页面并提示错误
	        case 302:
	            break;
	        // 被踢, 请提示错误后跳转到登录页面
	        case 'kicked':
	            break;
	        default:
	            break;
	        }
	    }
	    $('#chat').append("<div><span class='message'>连接断开</span></div>"); 
	}
	function onChatroomError(error, obj) {
	    console.log('发生错误', error, obj);
	}
	function onChatroomMsgs(msgs) {
	    console.log('收到聊天室消息', msgs);
	    for(var i=0;i<msgs.length;i++){
	    	if(msgs[i].content){
	    		// 解析等级
		    	var custom=msgs[i].custom?JSON.parse(msgs[i].custom):'';
	    		var level = 'first';
	    		if(custom){
	    			if(custom.level>22){
		    			level='fouth';
		    		}else if(custom.level>12){
						level='third';
		    		}else if(custom.level>1){
		    			level='second';
		    		}
	    		}
	    		// 礼物
	    		var content=JSON.parse(msgs[i].content);
	    		var giftType=content.data.giftType;
	    		var giftImg=content.data.giftShowImage.indexOf('http')>-1?content.data.giftShowImage:'http://img.wangyuhudong.com/'+content.data.giftShowImage;
	    		
	    		if(content.data.giftNum>1){
	    			// $('#chat').append("<div class='gift'><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+level+"_level.png);'>"+custom.level+"</span><span class='fc-nick'>"+content.data.senderName+"</span><span class='fc-gift'>送出了一个"+content.data.giftName+"<img src='"+giftImg+"' class='gift-icon' alt=''>x"+content.data.giftNum+"</span></span><div>");
	    			$('#chat').append("<div class='gift'><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+level+"_level.png);'>"+custom.level+"</span><span class='fc-nick'>"+content.data.senderName+"</span><span class='fc-gift'>送出了一个"+content.data.giftName+"<img src='"+giftImg+"' class='gift-icon' alt=''></span></span><div>");
	    		}else{
	    			$('#chat').append("<div class='gift'><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+level+"_level.png);'>"+custom.level+"</span><span class='fc-nick'>"+content.data.senderName+"</span><span class='fc-gift'>送出了一个"+content.data.giftName+"<img src='"+giftImg+"' class='gift-icon' alt=''></span></span><div>");
	    		}

	    		if(giftType==1){
	    			// 飘屏礼物
	    			if($(".huge-gift").is(":animated")){

					}else{
						vm.hugeGift = {
			    			sender_icon:content.data.headIcon,
			    			sender_name:content.data.senderName,
			    			gift_name:content.data.giftName,
			    			gift_icon:giftImg
			    		}
						$('.huge-gift').css({'width':$('.huge-gift').width()+2,'left':'100%'});
						$('.huge-gift').animate({'left':'-100%'},5000);
					}
	    		}else if(giftType==2){
	    			// 连击礼物
	    			var giftContent = {
		    			sender_icon:content.data.headIcon,
		    			sender_name:content.data.senderName,
		    			gift_name:content.data.giftName,
		    			gift_icon:giftImg
		    		}
		    		var num = content.data.giftNum;
	    			giftCombo(giftContent,num);
	    		}else if(giftType==3){
	    			$('.cool-gift div').removeClass();
	    			if(content.data.giftName=='女神'){
	    				$('.cool-gift div').addClass('goddess');
	    				setTimeout(function(){
	    					$('.cool-gift div').removeClass('goddess');
	    				},2500);
	    			}else if(content.data.giftName=='跑车'){
	    				$('.cool-gift div').addClass('car');
	    				setTimeout(function(){
	    					$('.cool-gift div').removeClass('car');
	    				},3000);
	    			}else if(content.data.giftName=='求婚'){
	    				$('.cool-gift div').addClass('merry');
	    				setTimeout(function(){
	    					$('.cool-gift div').removeClass('merry');
	    				},2500);
	    			}
	    			
	    		}
	    	}else if(msgs[i].fromClientType == 'Server' && msgs[i].text){
	    		var content=JSON.parse(msgs[i].content);
	    		if($(".globel-note").is(":animated")){

				}else{
					vm.trumpet={
			            name:content.data.senderName,
			            content:'出手豪气送出了一个'+content.data.giftName
			        },
					$('.globel-note').css({'width':'auto','left':'100%'});
					$('.globel-note').animate({'width':'auto','left':'-100%'},5000);
				}
	    	}else if(msgs[i].text && msgs[i].fromNick && msgs[i].fromClientType != 'Server'){
	    		console.log(13545645);
	    		// 发言
	    		// 解析等级
		    	var custom=msgs[i].custom?JSON.parse(msgs[i].custom):'';
	    		var level = 'first';
	    		if(custom){
	    			if(custom.level>22){
		    			level='fouth';
		    		}else if(custom.level>12){
						level='third';
		    		}else if(custom.level>1){
		    			level='second';
		    		}
	    		}
	    		var host = msgs[i].fromNick=="1" ? '<label for="">主播</label>&nbsp;' : '';
	    		if(custom.system){
	    			$('#chat').append("<div><span class='message fc-cf'>"+msgs[i].text+"</span><div>");
	    		}else{
	    			$('#chat').append("<div><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+level+"_level.png);'>"+custom.level+"</span>"+host+"<span class='fc-nick'>"+msgs[i].fromNick+":</span>"+msgs[i].text+"</span><div>");
	    		}   		
	    	}else if(msgs[i].text && !msgs[i].fromNick && msgs[i].custom){
	            $('#chat').append("<div><span class='bubble'><span class='fromNick'>"+custom.nickname+":&nbsp;&nbsp;</span>"+msgs[i].text+"</span></div>");        
	        }else if(msgs[i].flow=="in" && !msgs[i].text && msgs[i].attach.fromNick && msgs[i].attach.type=="memberEnter"){
	        	// 进入直播间
	        	// 解析等级
	        	getMembers();
		    	var custom=msgs[i].attach.custom?JSON.parse(msgs[i].attach.custom):'';
				var level = 'first';
				if(custom){
					if(custom.level>22){
		    			level='fouth';
		    		}else if(custom.level>12){
						level='third';
		    		}else if(custom.level>1){
		    			level='second';
		    		}
				}
				// 高等级用户进入飘屏
				if(custom.level>17){
					if($(".vip-enter").is(":animated")){

					}else{
						vm.vip = {
			    			range:custom.level,
			    			name:msgs[i].attach.fromNick
			    		}
		    			$('.vip-enter').css({'width':'auto','left':'110%'});
						$('.vip-enter').animate({'width':'auto','left':'-100%'},5000);
					}
				}
	    		$('#chat').append("<div><span class='message fc-enter'><span class='levelMedal' style='background-image: url(/share/images/"+level+"_level.png);'>"+custom.level+"</span><span class='fc-nick'>"+msgs[i].attach.fromNick+"</span>进入直播间</span></div>");
	    	}else if(msgs[i].flow=="in" && msgs[i].text && msgs[i].custom =="" ){
	    		var a = msgs[i].text.slice(0,2);
	    		var b = msgs[i].text.slice(2).slice(0,-5);
	    		var c = msgs[i].text.slice(2).slice(-5);
	            $('#chat').append('<div><span class="bubble">'+a+'<span class="s-bl">'+b+'</span>'+c+'</span></div>');
	        }
	    	lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);    	
	    }
	}
}