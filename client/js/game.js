// 扑克牌数量
var pokerNum = 0;

// 牌组位置
var leftarr = [];
for(var i=0;i<3;i++){
	leftarr.push($('.poker-area').eq(i).offset().left);
}
// 定位
var top = $('.poker-area').eq(0).offset().top;
// 发牌动画延迟
var delay = 50;
var vm = window.rainbow;

var ws;//websocket实例
var lockReconnect = false;//避免重复连接
var wsUrl = 'ws:172.16.10.3:9802';

function createWebSocket(url) {
    try {
        ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";  
        initEventHandle();
    } catch (e) {
        reconnect(url);
    }     
}

function initEventHandle() {
    ws.onclose = function () {
        console.log('关闭');
        reconnect(wsUrl);
    };
    ws.onerror = function () {
        reconnect(wsUrl);
    };
    ws.onopen = function () {
        console.log('已连接');
        // 获取游戏状态
        // getState();
        
        //心跳检测重置
        // heartCheck.start();
        setInterval(function(){
            var buffer = new ByteArray();  
            var timestamp = Date.parse(new Date());
            buffer.writeInt(parseInt(0));
            buffer.writeInt(parseInt(1)); 
            buffer.writeDouble(timestamp); 
            buffer.writeInt(parseInt(1));
            buffer.writeInt(parseInt(1));
            buffer.position = 0;
            ws.send(buffer.data);
        },30000)
    };
    ws.onmessage = function (event) {
        // encodeMes(event);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        // heartCheck.reset().start();
    }
}

function reconnect(url) {
    if(lockReconnect) return;
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
    }, 2000);
}


//心跳检测
var heartCheck = {
    timeout: 30000,//60秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        console.log('heartbeat');
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            var buffer = new ByteArray();  
            var timestamp = Date.parse(new Date());
            buffer.writeInt(parseInt(0));
            buffer.writeInt(parseInt(1)); 
            console.log(timestamp);
            buffer.writeDouble(timestamp); 
            buffer.writeInt(parseInt(1));
            buffer.writeInt(parseInt(1));
            buffer.position = 0;
            console.log(buffer);
            ws.send(buffer.data);
            console.log(ws);
            //onmessage拿到返回的心跳就说明连接正常
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}

createWebSocket(wsUrl);

// 游戏状态
function getState(){
    var obj = {  
        liveId:1,   //直播间ID
    };
    sendMes(obj,'CGGameState',10009);
}

// 发送websocket
function sendMes(obj,protoName,startIndex){
    var ProtoBuf = dcodeIO.ProtoBuf;  
    var proto = ProtoBuf.loadProtoFile("/share/data/RainbowMessage.proto");  
    var RequestMessage   = proto.build(protoName);  
    
    var request = new RequestMessage(obj);  
    var msgArray = request.toArrayBuffer();  
  
    var content = new ByteArray(msgArray);  
    var buffer = new ByteArray();  
    var buffer = new ByteArray();  
    var timestamp = Date.parse(new Date());
    buffer.writeInt(parseInt(msgArray.byteLength));
    buffer.writeInt(parseInt(startIndex)); 
    buffer.writeDouble(timestamp); 
    buffer.writeInt(parseInt(1));
    buffer.writeInt(parseInt(1));
    // buffer.position = 0; 
    buffer.writeBytes(content);  
    ws.send(buffer.data);  
}

// 解析websocket
function encodeMes(event){
    console.log(event);
    var tempBuffer = new ByteArray();  
    tempBuffer._writeUint8Array(new Uint8Array(event.data));  
    tempBuffer.position = 0;  
    var msgBuffer = new ByteArray(); 
    tempBuffer.readBytes(msgBuffer, 4);   
    var content = tempBuffer.readInt(msgBuffer); 
    content =  tempBuffer.readInt(msgBuffer);
    console.log(content);
    var ProtoBuf = dcodeIO.ProtoBuf;  
    var protoName= '';
    switch(content) {
        case 10002:
            {
                protoName = "GCBetRet";
                break;
            }
        case 10004:
            {
                protoName = "GCOpenRet";
                break;
            }
        case 10006:
            {
                protoName = "GCResultRet";
                break;
            }
        case 10008:
            {

                protoName = "GCSendGiftRet";
                break;
            }
        case 10010:
            {
                protoName = "GCGameStateRet";
                break;
            }
        case 10012:
            {
                protoName = "GCOutLiveRoomRet";
                break;
            }
        case 10014:
            {
                protoName = "GCCathNowInfoRet";
                break;
            }
        default:
            {
                protoName = "UNKNOW";
                break;
            }
    }
    console.log(protoName);
    var CommandMessage = ProtoBuf  
            .loadProtoFile("/share/data/RainbowMessage.proto").build(protoName);  
    var command = CommandMessage.decode(event.data);  
    console.log(command); 
}

$('.op-chat').click(function(){
    var ProtoBuf = dcodeIO.ProtoBuf;  
    var proto = ProtoBuf.loadProtoFile("/share/data/RainbowMessage.proto");  
    var RequestMessage   = proto.build("CGBet");  
    var obj = {  
        userId:1,   //用户id
        index :2,   //下注位
        value :3,   //下注值
        gameId:4,   //游戏id
        chessboardId:5,   //局id
        liveId:6,   //直播间ID
        token :'8987756454454',  
    };
    var request = new RequestMessage(obj);  
    var msgArray = request.toArrayBuffer();  
  
    var content = new ByteArray(msgArray);  
    var buffer = new ByteArray();  
    var buffer = new ByteArray();  
    var timestamp = Date.parse(new Date());
    buffer.writeInt(parseInt(msgArray.byteLength));
    buffer.writeInt(parseInt(10001)); 
    buffer.writeDouble(timestamp); 
    buffer.writeInt(parseInt(1));
    buffer.writeInt(parseInt(1));
    // buffer.position = 0; 
    console.log(content);
    buffer.writeBytes(content);  
    console.log(buffer.data);
    ws.send(buffer.data);  
})

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
createPoker();