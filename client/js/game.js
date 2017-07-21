var gameProgress = function(){
    var vm = window.rainbow;
    // 扑克牌数量
    var pokerNum = 0;

    // 牌组位置
    // var leftarr = [];
    function pokerPosition(){
        if(vm.gameType==1){
            vm.leftarr = [];
            // 欢乐牛牛卡牌定位
            Vue.nextTick(function(){
                for(var i=0;i<3;i++){
                    vm.leftarr.push($('.poker-area').eq(i).offset().left);
                }
                console.log(vm.leftarr);
            })
        }else if(vm.gameType==2){           
            vm.leftarr = [];
            Vue.nextTick(function(){
                for(var i=0;i<2;i++){
                    vm.leftarr.push($('.m-rc .poker-area').eq(i).offset().left);
                }
                console.log(vm.leftarr);
            })           
        }else if(vm.gameType==3){           
            vm.leftarr = [];
            Vue.nextTick(function(){
                for(var i=0;i<2;i++){
                    vm.leftarr.push($('.game-box .poker-area').eq(i).offset().left);
                }
                console.log(vm.leftarr);
            })           
        }        
    }
    // pokerPosition();

    window.addEventListener("resize", function(){
        pokerPosition();
    }, false); 

    // 更新游戏倍率
    function freshRate(){
        $.ajax({
            method: "GET",
            url: "/api/rainbow/gameInfo",
            dataType: 'json',
            data: {
                gameId:vm.gameType,
            },
            success: function(data) {
                vm.game.rate_first = data.object.rate_first;
                vm.game.rate_second = data.object.rate_second;
                vm.game.rate_third = data.object.rate_third;
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        });
    }
    // 庄家信息
    function freshBanker(id){
        $.ajax({
            method: "GET",
            url: "/api/rainbow/userInfo",
            dataType: 'json',
            data: {
                otherId:id,
                // userId:2
            },
            success: function(data) {
                vm.hero.banker.user_icon = data.object.icon;
                vm.hero.banker.name = data.object.nickname;
                vm.hero.banker.sweet = data.object.rainbow_sweet;
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        });
    }
    
    // 定位
    // var top = $('.poker-area').eq(0).offset().top;
    // 发牌动画延迟
    var delay = 50;

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
        sendMes(obj,'CGEnterLiveRoom',10022);
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
                    if(vm.half_enter == true){
                        vm.half_group = [true,true,true];
                    }
                    vm.game.cardsSet1 = ws.cardsSet1.Cards;
                    vm.game.cardsSet2 = ws.cardsSet2==null?[]:ws.cardsSet2.Cards;
                    vm.game.cardsSet3 = ws.cardsSet3.Cards;
                    vm.game.result1 = ws.cardsSet1.nameNo==null?0:ws.cardsSet1.nameNo;
                    if(vm.gameType!=2){
                        vm.game.result2 = ws.cardsSet2.nameNo==null?0:ws.cardsSet2.nameNo;
                    }
                    vm.game.result3 = ws.cardsSet3.nameNo==null?0:ws.cardsSet3.nameNo;
                    vm.game.winIndex = ws.winIndex-1;
                    vm.game.showTip = false;
                    if(vm.gameType==3){
                        vm.hero.bankerCardsSet = ws.bankerCardsSet.Cards;
                        vm.hero.result = ws.bankerCardsSet.nameNo==null?0:ws.bankerCardsSet.nameNo;
                    }
                    showResult(0);
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
            case 10019:
                {
                    protoName = "GCChangeGameRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);
                    vm.gameType = ws.gameId; 
                    pokerPosition();
                    freshRate();
                    break;
                }
            case 10027:
                {
                    protoName = "GCUpBankerListRet";
                    var wsMessage = proto.build(protoName);  
                    var ws = wsMessage.decode(msgBuffer.data.buffer);
                    console.log(ws);
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
        if(data.banker!=1 && data.banker!=null){
           freshBanker(data.bankerId); 
        }       
        if(data.gameId!=vm.gameType){
            vm.gameType = data.gameId; 
            pokerPosition();
            freshRate();
        }
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
            vm.rc.mask = [false,false,false];
            vm.rc.result_mask = false;
            vm.hero.poker_group = [false,false,false,false];
            vm.game.tip = '即将开始，请稍后';
            vm.game.showTip = true;
        }else if(data.state==2){
            vm.half_enter = false;
            vm.game.showTip = false;
            createPoker();
        }else if(data.state==3){
            if(vm.half_enter == true){
                vm.half_group = [true,true,true];
                vm.hero.half_group = [true,true,true,true];
            }
            vm.game.showTip = false;
            vm.game.time = data.countDown;
            countDown();
            if(vm.game.time>0){
                $('.stake-area').on('click',function(){
                    alert(1);
                })
            }
            // setTimeout(function(){
            //     vm.game.tipClass = 'animated bounceOut';
            //     setTimeout(countDown,750);
            // },1000)
            // $('.game-tip').addClass('animated bounceIn');
        }else if(data.state==4){
            if(vm.half_enter == true){
                vm.half_group = [true,true,true];
                vm.hero.half_group = [true,true,true,true];
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
        if(vm.gameType==1){
            if(pokerNum<15){
                var initleft = $('.deal-section li').eq(pokerNum).offset().left;
                var inittop = $('.deal-section li').eq(pokerNum).offset().top;
                $('.deal-section li').eq(pokerNum).css({left:initleft+0.5*width,top:inittop+0.5*height});
                if(pokerNum<5){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[0]+0.86*width+0.35*width*(pokerNum%5)},500);
                }else if(pokerNum<10){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[1]+0.86*width+0.35*width*(pokerNum%5)},500);
                }else{
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[2]+0.86*width+0.35*width*(pokerNum%5)},500);
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
        }else if(vm.gameType==2){
            if(pokerNum<10){
                var initleft = $('.deal-section li').eq(pokerNum).offset().left;
                var inittop = $('.deal-section li').eq(pokerNum).offset().top;
                $('.deal-section li').eq(pokerNum).css({left:initleft+0.5*width,top:inittop+0.5*height});
                if(pokerNum<5){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[0]+0.49*width+0.45*width*(pokerNum%5)},500);
                }else{
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[1]+0.49*width+0.45*width*(pokerNum%5)},500);
                }
                pokerNum++;
                if(pokerNum==5){                        
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
        }else if(vm.gameType==3){
            if(pokerNum<20){
                var initleft = $('.deal-section li').eq(pokerNum).offset().left;
                var inittop = $('.deal-section li').eq(pokerNum).offset().top;
                $('.deal-section li').eq(pokerNum).css({left:initleft+0.5*width,top:inittop+0.5*height});
                var bankerTop = $('.m-banker .poker-area').eq(0).offset().top;
                var bankerLeft = $('.m-banker .poker-area').eq(0).offset().left;
                if(pokerNum<5){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":bankerTop+height/2,"left":bankerLeft+0.82*width+0.35*width*(pokerNum%5)},500);
                }else if(pokerNum<10){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[0]+0.86*width+0.35*width*(pokerNum%5)},500);
                }else if(pokerNum<15){
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[1]+0.86*width+0.35*width*(pokerNum%5)},500);
                }else{
                    $('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":vm.top+height/2,"left":vm.leftarr[2]+0.86*width+0.35*width*(pokerNum%5)},500);
                }
                pokerNum++;
                if(pokerNum==5 || pokerNum==10 || pokerNum==15){                        
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
        if(vm.gameType<3){
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
                    if(vm.gameType==1){
                        vm.game.mask.forEach(function(e,index){  
                            if(index != vm.game.winIndex){
                                Vue.set(vm.game.mask, index, true);
                            }
                        }) 
                    }else if(vm.gameType==2){
                        vm.rc.mask.forEach(function(e,index){ 
                            if(index == vm.game.winIndex){
                                Vue.set(vm.rc.mask, index, true);
                            }
                        }) 
                        vm.rc.result_mask = true;
                    }
                                 
                }
            } else{
                // vm.game.poker_group = [false,false,false];
            }
        }else if(vm.gameType==3){
            // 三英战吕布
            if(arr_index<4){
                // vm.game.poker_group[arr_index] = true;
                Vue.set(vm.hero.poker_group, arr_index, true);
                Vue.set(vm.hero.half_group, arr_index, false);
                // console.log(vm.game.poker_group[arr_index]);
                if(arr_index==0){
                    for(var i=0;i<5;i++){
                        $('.deal-section li').eq(i).hide();
                    }
                }
                setTimeout(function(){  
                    arr_index++;
                    showResult(arr_index);
                },1000); 
            } else{
                // vm.game.poker_group = [false,false,false];
            }
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
    // createPoker();
}

gameProgress();

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