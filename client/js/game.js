var niuniu = function(){
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
    // var wsUrl = 'ws:172.16.10.3:9801';
    var wsUrl = 'ws:118.190.21.195:9801';
    // var wsUrl = 'ws:www.caihonglive.tv:9801';

    var ProtoBuf = dcodeIO.ProtoBuf;  
    var proto = ProtoBuf.loadProtoFile("/share/data/RainbowMessage.proto");  

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
            getState();
            // 获取实时投注
            getCathectic();
            
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
            },50000)
        };
        ws.onmessage = function (event) {
            encodeMes(event);
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

    // 欢乐牛牛
    createWebSocket(wsUrl);

    // 游戏状态
    function getState(){
        var obj = {  
            liveId:vm.live_id,   //直播间ID
        };
        sendMes(obj,'CGGameState',10009);
    }

    // 实时投注
    function getCathectic(){
        var obj = {  
            liveId:vm.live_id,   //直播间ID
        };
        sendMes(obj,'CGCathNowInfo',10013);
    }

    // 发送websocket
    function sendMes(obj,protoName,startIndex){
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
        // console.log(event.data.byteLength);
        var tempBuffer = new ByteArray();  
        tempBuffer._writeUint8Array(new Uint8Array(event.data)); 
        //跳到协议号位置 
        tempBuffer.position = 4;  
        var msgBuffer = new ByteArray();  
        // 协议号
        var packetId=tempBuffer.readInt(); 
        console.log('协议号:'+packetId);
        // 跳到数据体位置
        tempBuffer.position = 24;  
        var cont = tempBuffer.readBytes(msgBuffer,tempBuffer.position,event.data.byteLength);
        var ProtoBuf = dcodeIO.ProtoBuf; 
        //协议名 
        var protoName= '';
        switch(packetId) {
            case 10002:
                {
                    protoName = "GCBetRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);  
                    break;
                }
            case 10004:
                {
                    protoName = "GCOpenRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);  
                    break;
                }
            case 10006:
                {
                    protoName = "GCResultRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer); 
                    console.log(ws);
                    vm.game.cardsSet1 = ws.cardsSet1.Cards;
                    vm.game.cardsSet2 = ws.cardsSet2.Cards;
                    vm.game.cardsSet3 = ws.cardsSet3.Cards;
                    vm.game.result1 = ws.cardsSet1.nameNo==null?0:ws.cardsSet1.nameNo;
                    vm.game.result2 = ws.cardsSet2.nameNo==null?0:ws.cardsSet2.nameNo;
                    vm.game.result3 = ws.cardsSet3.nameNo==null?0:ws.cardsSet3.nameNo;
                    vm.game.winIndex = ws.winIndex-1;
                    vm.game.showTip = false;
                    showResult(0);

                    // console.log(vm.game.cardsSet1);

                    break;
                }
            case 10008:
                {
                    protoName = "GCSendGiftRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);  
                    break;
                }
            case 10010:
                {
                    protoName = "GCGameStateRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);  
                    gameState(ws);
                    break;
                }
            case 10012:
                {
                    protoName = "GCOutLiveRoomRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);  
                    break;
                }
            case 10014:
                {
                    protoName = "GCCathNowInfoRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);
                    console.log(ws);  
                    vm.game.catNum1 = ws.index1Total==null?0:ws.index1Total;
                    vm.game.catNum2 = ws.index2Total==null?0:ws.index2Total;
                    vm.game.catNum3 = ws.index3Total==null?0:ws.index3Total;
                    break;
                }
            case 10016:
                {
                    protoName = "GCCloseLiveRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);
                    console.log(ws);  
                    vm.state = 2;
                    break;
                }
            case 10017:
                {
                    protoName = "GCCloseGameRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);
                    console.log(ws); 
                    vm.state = 0; 
                    break;
                }
            default:
                {
                    protoName = "UNKNOW";
                    break;
                }
        }
    }

    // 牌局状态
    function gameState(data){
        console.log(data);
        if(data.state == 1 || data.state == 5){
            vm.game.catNum1 = 0;
            vm.game.catNum2 = 0;
            vm.game.catNum3 = 0;
            vm.half_enter = false;
            // 重置牌局
            $('.deal-section ul').html('');
            pokerNum = 0;
            vm.game.poker_group = [false,false,false];
            vm.game.mask = [false,false,false];
            vm.game.tip = '即将开始，请稍后';
            vm.game.showTip = true;
        }else if(data.state==2){
            vm.half_enter = false;
            vm.game.showTip = false;
            createPoker();
        }else if(data.state==3){
            if(vm.half_enter == true){
                vm.half_group = [true,true,true];
            }
            vm.game.showTip = false;
            vm.game.time = data.countDown;
            countDown();
            // setTimeout(function(){
            //     vm.game.tipClass = 'animated bounceOut';
            //     setTimeout(countDown,750);
            // },1000)
            // $('.game-tip').addClass('animated bounceIn');
        }else if(data.state==4){
            if(vm.half_enter == true){
                vm.half_group = [true,true,true];
            }
            vm.game.time = 0;
            vm.game.showClock = false;
            vm.game.tip = '揭晓结果';
            vm.game.showTip = true;
            vm.game.tipClass = 'animated bounceIn';
            // setTimeout(function(){  
            //     vm.game.showTip = false;
            // },1000);
        }
    }

    // 发牌
    function dealPoker(){
        var width = $('.deal-section li').eq(0).width();
        var height = $('.deal-section li').eq(0).height();
        if(pokerNum<15){
            var initleft = $('.deal-section li').eq(pokerNum).offset().left;
            var inittop = $('.deal-section li').eq(pokerNum).offset().top;
            $('.deal-section li').eq(pokerNum).css({left:initleft+0.5*width,top:inittop+0.5*height});
            if(pokerNum<5){
                $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[0]+0.86*width+0.35*width*(pokerNum%5)},500);
            }else if(pokerNum<10){
                $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[1]+0.86*width+0.35*width*(pokerNum%5)},500);
            }else{
                $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[2]+0.86*width+0.35*width*(pokerNum%5)},500);
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
            vm.game.tip = '开始下注';
            vm.game.showTip = true;
            vm.game.tipClass = 'animated bounceIn';
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
        }
    }

    // 显示结果
    function showResult(index){
        vm.half_enter = false;
        var arr_index = parseInt(index);
        if(arr_index<3){
            // vm.game.poker_group[arr_index] = true;
            Vue.set(vm.game.poker_group, arr_index, true);
            Vue.set(vm.half_group, arr_index, false);
            // console.log(vm.game.poker_group[arr_index]);
            setTimeout(function(){  
                arr_index++;
                showResult(arr_index);
            },1000); 
            if(arr_index==2){
                // vm.game.mask = [true,false,true];
                vm.game.mask.forEach(function(e,index){  
                    if(index != vm.game.winIndex){
                        Vue.set(vm.game.mask, index, true);
                    }
                    // alert(index);  
                })              
            }
        } else{
            // vm.game.poker_group = [false,false,false];
        }
    }

    // 添加扑克牌
    function createPoker(){
        for(i=0;i<5;i++){
            var li = $('<li></li>');
            $('.deal-section ul').append(li);
        }
        dealPoker();
    }
}

// niuniu();


// 游戏区显示隐藏
$(".m-video").on("touchstart", function(e) {
    e.preventDefault();
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
$(".m-video").on("touchmove", function(e) {
    e.preventDefault();
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY,
    X = moveEndX - startX,
    Y = moveEndY - startY;

    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
        // alert("left 2 right");
    }
    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
        // alert("right 2 left");
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
        // alert("top 2 bottom");
        $('.m-game').css({opacity:0}) && $('.deal-section').css({opacity:0});
        $('.m-chat,.m-operate').css({top:'5rem'});
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
        // alert("bottom 2 top");
        $('.m-game').css({opacity:1}) && $('.deal-section').css({opacity:1});
        $('.m-chat,.m-operate').css({top:0});
    }
    
});