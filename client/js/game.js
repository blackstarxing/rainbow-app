var pokerNum = 0;
var leftarr = [];
for(var i=0;i<3;i++){
	leftarr.push($('.poker-area').eq(i).offset().left);
}
var top = $('.poker-area').eq(0).offset().top;
var delay = 50;
var vm = window.rainbow;

if ("WebSocket" in window){

    // 打开一个 web socket
    var ws = new WebSocket("ws://172.16.10.3:9801");

    function checkSocket() {
        if(ws != null) {
            var stateStr;
            switch(ws.readyState) {
                case 0:
                    {
                        stateStr = "CONNECTING";
                        break;
                    }
                case 1:
                    {
                        stateStr = "OPEN";
                        break;
                    }
                case 2:
                    {
                        stateStr = "CLOSING";
                        break;
                    }
                case 3:
                    {

                        stateStr = "CLOSED";
                        break;
                    }
                default:
                    {
                        stateStr = "UNKNOW";
                        break;
                    }
            }
            console.log("WebSocket state = " + ws.readyState + " ( " + stateStr + " )");
        } else {
            console.log("WebSocket is null");
        }
    }
    // setInterval(checkSocket,500)
    ws.onopen = function(event){
        console.log(event);
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send("发送数据");
        console.log("数据发送中...");
    };
    
    ws.onmessage = function (evt) { 
      var received_msg = evt.data;
      console.log("数据已接收...");
    };
    
    ws.onclose = function()
    { 
      // 关闭 websocket
      console.log("连接已关闭..."); 
    };
}else{
   // 浏览器不支持 WebSocket
   console.log("您的浏览器不支持 WebSocket!");
}
ws.binaryType = "arraybuffer";  


// if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
//     throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
// }
// // 创建ProtoBuf
// var ProtoBuf = dcodeIO.ProtoBuf;
// var proto = ProtoBuf.loadProtoFile("/share/data/RainbowMessage.proto");  
 
// // 先构造两个子模块
// // 子模块－１
// // var ChildrenModule_1 = proto.build("GCBetRet");
// // var childrenModule_1 = new ChildrenModule_1();
// // childrenModule_1.setNumber(1);
// // childrenModule_1.setName("Nginx5.0 初级案例");
 
// // 子模块－２
// // var ChildrenModule_2 = proto.build("CGOpen");
// // var childrenModule_2 = new ChildrenModule_2();
// // childrenModule_2.setNumber(2);
// // childrenModule_2.setName("Nginx5.0 中级案例");
 
// // 父模块
// var ParentModule = proto.build("CGOpen");
 
// // 像父模块设置值
// var parentModule = new ParentModule();
// parentModule.setUserId(1);
// parentModule.setToken("Nginx5.0");
// // parentModule.setChildrenModule(new Array(childrenModule_1,childrenModule_2));
 
// // 打印父模块此时数据【火狐浏览器Ｆ12进行观察】
// console.log("ProtoBuf对象数据：");
// console.log(parentModule);
 
// // 模拟发送
// // 1.对象转字节：parentModule.toArrayBuffer() 
// // 2.字节转对象：ParentModule.decode()
// var msgDec = ParentModule.decode(parentModule.toArrayBuffer());
// // 接收到的数据：
// console.info("接收到的数据：");
// console.info(parentModule.toArrayBuffer());
// // 打印转换后的信息
// console.info("经过ParentModule.decode转换后的数据：");
// console.info(msgDec);

// 发牌
function dealPoker(){
	var width = $('.deal-section li').eq(0).width();
	var height = $('.deal-section li').eq(0).height();
	if(pokerNum<15){
        var initleft = $('.deal-section li').eq(pokerNum).offset().left;
        var inittop = $('.deal-section li').eq(pokerNum).offset().top;
        $('.deal-section li').eq(pokerNum).css({left:initleft+0.5*width,top:inittop+0.5*height});
		if(pokerNum<5){
		    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[0]+0.86*width+0.35*width*(pokerNum%5)},250);
		}else if(pokerNum<10){
			$('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[1]+0.86*width+0.35*width*(pokerNum%5)},250);
		}else{
			$('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[2]+0.86*width+0.35*width*(pokerNum%5)},250);
		}
		pokerNum++;
		if(pokerNum==5 || pokerNum==10){ 						
			delay=300;
			setTimeout(function(){ 					
				createPoker();
			},delay);
		}else{
			delay=50;
			setTimeout(function(){ 					
				dealPoker();
			},delay);
		}
	
	}else{
        vm.game.tip = '开始支持';
        vm.game.showTip = true;
        vm.game.tipClass = 'animated bounceIn';
        setTimeout(function(){
            vm.game.tipClass = 'animated bounceOut';
            setTimeout(countDown,750);
        },1000)
        // $('.game-tip').addClass('animated bounceIn');
    }
}

// 下注倒计时
function countDown(){
    if(vm.game.time>0){
       vm.game.showClock = true;
        setTimeout(function(){  
            vm.game.time--;                 
            countDown();
        },1000);
    }else{
        vm.game.showClock = false;
        vm.game.tip = '揭晓结果';
        vm.game.showTip = true;
        vm.game.tipClass = 'animated bounceIn';
        setTimeout(function(){  
            vm.game.showTip = false;
            showResult(0);
        },1000);
    }
}

// 显示结果
function showResult(index){
    var arr_index = parseInt(index);
    if(arr_index<3){
        // vm.game.poker_group[arr_index] = true;
        Vue.set(vm.game.poker_group, arr_index, true);
        // console.log(vm.game.poker_group[arr_index]);
        setTimeout(function(){  
            arr_index++;
            showResult(arr_index);
        },1000); 
        if(arr_index==2){
            vm.game.mask = [true,false,true];
        }
    } else{
        // vm.game.poker_group = [false,false,false];
    }
}

// 添加扑克牌
function createPoker(){
	for(i=0;i<5;i++){
		var li = $('<li></li>');
		$('.deal-section').append(li);
	}
	dealPoker();
}
// createPoker();