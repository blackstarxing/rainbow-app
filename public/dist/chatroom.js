!function(e){function t(n){if(a[n])return a[n].exports;var i=a[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var a={};t.m=e,t.c=a,t.i=function(e){return e},t.d=function(e,a,n){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="http://localhost:3000/dist",t(t.s=5)}({1:function(e,t){function a(e,t){if("number"==typeof e&&"number"==typeof t)return e==t;var n=Object.getOwnPropertyNames(e),i=Object.getOwnPropertyNames(t);if(n.length!=i.length)return!1;for(var o=0;o<n.length;o++){var s=n[o];if("[Object Object]"!=Object.prototype.toString(e[s])&&"[Object Object]"!=Object.prototype.toString(t[s])||a(e[s],t[s]),e[s]!==t[s])return!1}return!0}function n(e,t){if(f={sender_icon:o.gift_info1.sender_icon,sender_name:o.gift_info1.sender_name,gift_name:o.gift_info1.gift_name,gift_icon:o.gift_info1.gift_icon},d={sender_icon:o.gift_info2.sender_icon,sender_name:o.gift_info2.sender_name,gift_name:o.gift_info2.gift_name,gift_icon:o.gift_info2.gift_icon},a(f,e)){var n=(new Date).getTime();clearTimeout(c),s=n,o.gift_num_top=t,$(".wrap-top .gift-num").removeClass("animated bounceIn").addClass("animated bounceIn"),c=setTimeout(function(){o.gift_info1="",o.gift_num_top=1,$(".wrap-top").removeClass("slideInLeft").addClass("animated slideOutLeft")},5e3)}else if(a(d,e)){var i=(new Date).getTime();clearTimeout(l),r=i,o.gift_num_bottom=t,$(".wrap-bottom .gift-num").removeClass("bounceIn").addClass("animated bounceIn"),l=setTimeout(function(){o.gift_info2="",o.gift_num_bottom=1,$(".wrap-bottom").removeClass("slideInLeft").addClass("animated slideOutLeft")},5e3)}else if(""==o.gift_info1){var n=(new Date).getTime();o.gift_info1=e,o.gift_num_top=t,$(".wrap-top").removeClass("slideOutLeft").addClass("animated slideInLeft"),s=n,c=setTimeout(function(){o.gift_info1="",o.gift_num_top=1,$(".wrap-top").removeClass("slideInLeft").addClass("animated slideOutLeft")},5e3)}else if(""==o.gift_info2){var i=(new Date).getTime();o.gift_info2=e,o.gift_num_bottom=t,$(".wrap-bottom").removeClass("slideOutLeft").addClass("animated slideInLeft"),r=i,l=setTimeout(function(){o.gift_info2="",o.gift_num_bottom=1,$(".wrap-bottom").removeClass("slideInLeft").addClass("animated slideOutLeft")},5e3)}}function i(){function e(){rainbowchatroom=Chatroom.getInstance({appKey:p,account:o.live_account,token:o.live_token,chatroomId:o.roomid,chatroomAddresses:l,onconnect:a,onerror:c,onwillreconnect:i,ondisconnect:s,onmsgs:r})}function t(){function e(e,t){o.audienceList=[],console.log("获取聊天室成员"+(e?"失败":"成功"),e,t.members),console.log(o.audienceList),t.members.forEach(function(e,t){var a=e.account.slice(5),n=""==e.custom?1:JSON.parse(e.custom).level;e.avatar&&o.audienceList.push({icon:e.avatar,userId:a,lv:n});var i=function(e,t){var a=e.lv,n=t.lv;return a>n?-1:a<n?1:0};o.audienceList.sort(i)})}rainbowchatroom.getChatroomMembers({guest:!0,limit:100,done:e})}function a(e){console.log("进入聊天室",e),t(),$("#chat").append("<div><span class='message fc-cf'>温馨提示：彩虹的直播互动仅供娱乐，请大家文明观看直播，理性参与游戏，适度娱乐，如有发现相关违规行为，请联系官方客服举报。查证属实的，彩虹将给予奖励。</span></div>")}function i(e){console.log("即将重连",e)}function s(e){console.log("连接断开",e),e&&e.code,$("#chat").append("<div><span class='message'>连接断开</span></div>")}function c(e,t){console.log("发生错误",e,t)}function r(e){console.log("收到聊天室消息",e);for(var a=0;a<e.length;a++){if(e[a].content){var i=e[a].custom?JSON.parse(e[a].custom):"",s="first";i&&(i.level>22?s="fouth":i.level>12?s="third":i.level>1&&(s="second"));var c=JSON.parse(e[a].content),r=c.data.giftType,l=c.data.giftShowImage.indexOf("http")>-1?c.data.giftShowImage:"http://img.wangyuhudong.com/"+c.data.giftShowImage;if(c.data.giftNum,$("#chat").append("<div class='gift'><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+s+"_level.png);'>"+i.level+"</span><span class='fc-nick'>"+c.data.senderName+"</span><span class='fc-gift'>送出了一个"+c.data.giftName+"<img src='"+l+"' class='gift-icon' alt=''></span></span><div>"),1==r)$(".huge-gift").is(":animated")||(o.hugeGift={sender_icon:c.data.headIcon,sender_name:c.data.senderName,gift_name:c.data.giftName,gift_icon:l},$(".huge-gift").css({width:$(".huge-gift").width()+2,left:"100%"}),$(".huge-gift").animate({left:"-100%"},5e3));else if(2==r){var d={sender_icon:c.data.headIcon,sender_name:c.data.senderName,gift_name:c.data.giftName,gift_icon:l},m=c.data.giftNum;n(d,m)}else 3==r&&($(".cool-gift div").removeClass(),"女神"==c.data.giftName?($(".cool-gift div").addClass("goddess"),setTimeout(function(){$(".cool-gift div").removeClass("goddess")},2500)):"跑车"==c.data.giftName?($(".cool-gift div").addClass("car"),setTimeout(function(){$(".cool-gift div").removeClass("car")},3e3)):"求婚"==c.data.giftName&&($(".cool-gift div").addClass("merry"),setTimeout(function(){$(".cool-gift div").removeClass("merry")},2500)))}else if("Server"==e[a].fromClientType&&e[a].text){var c=JSON.parse(e[a].content);$(".globel-note").is(":animated")||(o.trumpet={name:c.data.senderName,content:"出手豪气送出了一个"+c.data.giftName},$(".globel-note").css({width:"auto",left:"100%"}),$(".globel-note").animate({width:"auto",left:"-100%"},5e3))}else if(e[a].text&&e[a].fromNick&&"Server"!=e[a].fromClientType){var i=e[a].custom?JSON.parse(e[a].custom):"",s="first";i&&(i.level>22?s="fouth":i.level>12?s="third":i.level>1&&(s="second"));var u="1"==e[a].fromNick?'<label for="">主播</label>&nbsp;':"";i.system?$("#chat").append("<div><span class='message fc-cf'>"+e[a].text+"</span><div>"):$("#chat").append("<div><span class='message'><span class='levelMedal' style='background-image: url(/share/images/"+s+"_level.png);'>"+i.level+"</span>"+u+"<span class='fc-nick'>"+e[a].fromNick+":</span>"+e[a].text+"</span><div>")}else if(e[a].text&&!e[a].fromNick&&e[a].custom)$("#chat").append("<div><span class='bubble'><span class='fromNick'>"+i.nickname+":&nbsp;&nbsp;</span>"+e[a].text+"</span></div>");else if("in"==e[a].flow&&!e[a].text&&e[a].attach.fromNick&&"memberEnter"==e[a].attach.type){t();var i=e[a].attach.custom?JSON.parse(e[a].attach.custom):"",s="first";i&&(i.level>22?s="fouth":i.level>12?s="third":i.level>1&&(s="second")),i.level>17&&($(".vip-enter").is(":animated")||(o.vip={range:i.level,name:e[a].attach.fromNick},$(".vip-enter").css({width:"auto",left:"110%"}),$(".vip-enter").animate({width:"auto",left:"-100%"},5e3))),$("#chat").append("<div><span class='message fc-enter'><span class='levelMedal' style='background-image: url(/share/images/"+s+"_level.png);'>"+i.level+"</span><span class='fc-nick'>"+e[a].attach.fromNick+"</span>进入直播间</span></div>")}else if("in"==e[a].flow&&e[a].text&&""==e[a].custom){var g=e[a].text.slice(0,2),p=e[a].text.slice(2).slice(0,-5),v=e[a].text.slice(2).slice(-5);$("#chat").append('<div><span class="bubble">'+g+'<span class="s-bl">'+p+"</span>"+v+"</span></div>")}f.scrollTop=Math.max(0,f.scrollHeight-f.offsetHeight)}}var l=[],f=document.getElementById("chat"),d=new Date,m=(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds(),Math.round((new Date).getTime()/1e3)),u=new jsSHA("SHA-1","TEXT");u.update("0e41a6ff0d901"+m);var g=u.getHash("HEX"),p="76f43ad5b2a8603c628889449e72e3e7";$.ajax({url:"https://api.netease.im/nimserver/chatroom/requestAddr.action",contentType:"application/x-www-form-urlencoded;charset=utf-8",type:"POST",beforeSend:function(e){e.setRequestHeader("appkey",p),e.setRequestHeader("Nonce",1),e.setRequestHeader("CurTime",m),e.setRequestHeader("CheckSum",g)},data:{roomid:o.roomid,accid:o.accid}}).done(function(t){200===t.code?(l=t.addr,e()):$("#chat").append("<div><span class='message fc-cf'>获取连接房间地址失败!</span><div>")})}var o=window.rainbow,s=null,c=null,r=null,l=null,f="",d="",m=navigator.userAgent.toLowerCase(),u=document.getElementById("mainvideo");$(".play-btn").click(function(){u.play(),$(this).hide()}),"micromessenger"==m.match(/MicroMessenger/i)||"qq"==m.match(/QQ/i)&&(u.onplaying=function(){$(".play-btn").hide()}),u.onended=function(){},$.ajax({method:"GET",url:"/webapi/rainbow/mobile/visitor",dataType:"json",success:function(e){o.live_account=e.object.accid,o.live_token=e.object.token,i()},error:function(e,t,a){console.log("接口出问题啦")}}),$("#room").on("click",".icon-toplist",function(){var e=this;$.ajax({method:"GET",url:"/api/rainbow/userInfo",dataType:"json",data:{otherId:$(e).attr("data-id")},success:function(e){o.cardInfo=e.object},error:function(e,t,a){console.log("接口出问题啦")}}),o.cardDisplay=!0})},5:function(e,t,a){e.exports=a(1)}});