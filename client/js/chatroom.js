var vm = window.rainbow;

$.ajax({
    method: "GET",
    url: "http://172.16.10.3:8777/mobile/visitor",
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

function enterLiveroom(){
	console.log(5657)
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
	var CurTime = Date.UTC(y,m,d,h,mi,s);
	var roomid = parseInt(4174310);
	var shaObj = new jsSHA("SHA-1", "TEXT");
	// AppSecret
	shaObj.update('1981023862be'+1+CurTime);
	var hash = shaObj.getHash("HEX");

	// 获取聊天室信息重要参数
	var appKey = '5585496885932f31d478ed0222072bcf';

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
		var chatroom = Chatroom.getInstance({
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


	function onChatroomConnect(chatroom) {
	    console.log('进入聊天室', chatroom);
	    // $('#chat').append("<div><span class='bubble s-bl'><img src='../../static/images/welcome.png' alt=''>欢迎来到<span class='nick'>"+vm.details.nickname+"</span>的直播间，喜欢主播别忘点关注哦！</span></div>"); 
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
	    $('#chat').append("<div><span class='bubble'>连接断开</span></div>"); 
	}
	function onChatroomError(error, obj) {
	    console.log('发生错误', error, obj);
	}
	function onChatroomMsgs(msgs) {
	    console.log('收到聊天室消息', msgs);
	    // $('.chat').html(msgs)
	    for(var i=0;i<msgs.length;i++){
	    	if(msgs[i].content){
	    		var content=JSON.parse(msgs[i].content);
	    		// console.log(content);
	    		if(content.data.giftNum>1){
	    			$('#chat').append("<div class='gift'><span class='bubble'><span class='s-bl'>"+content.data.senderName+"</span>赠送给主播<span class='s-f36'>"+content.data.giftName+"</span><img src='"+content.data.giftShowImage+"' class='gift-icon' alt=''><span class='combo'>x"+content.data.giftNum+"</span></span><div>");
	    		}else{
	    			$('#chat').append("<div class='gift'><span class='bubble'><span class='s-bl'>"+content.data.senderName+"</span>赠送给主播<span class='s-f36'>"+content.data.giftName+"</span><img src='"+content.data.giftShowImage+"' class='gift-icon' alt=''></span><div>");
	    		}
	    	}else if(msgs[i].text && msgs[i].fromNick && msgs[i].fromClientType != 'Server'){
	    		var host = msgs[i].fromNick=="1" ? '<label for="">主播</label>&nbsp;' : '';
				$('#chat').append("<div><span class='bubble'>"+host+"<span class='fromNick'>"+msgs[i].fromNick+":&nbsp;&nbsp;</span>"+msgs[i].text+"</span><div>");   		
	    	}else if(msgs[i].text && !msgs[i].fromNick && msgs[i].custom){
	            var custom=JSON.parse(msgs[i].custom);
	            $('#chat').append("<div><span class='bubble'><span class='fromNick'>"+custom.nickname+":&nbsp;&nbsp;</span>"+msgs[i].text+"</span></div>");        
	        }else if(msgs[i].flow=="in" && !msgs[i].text && msgs[i].attach.fromNick && msgs[i].attach.type=="memberEnter"){
	    		$('#chat').append("<div><span class='bubble'>欢迎用户"+msgs[i].attach.fromNick+"进入直播间</span></div>");
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