rainbow = new Vue({
  	el: '#room',
  	delimiters: ['${', '}'],
  	data: {
        // 游戏类型
        gameType:0,
        // 卡牌位置
        top:'',
        leftarr:[],
        // 直播间数据
        info:'',
        // 直播结束推荐直播
        otherLive:'',
        // 直播间状态
        state:1,
  		// 直播间id
  		live_id:'',
  		accid:'',
  		roomid:'',
        live_account:'',
        live_token:'',
        // 用户列表
        audienceList:[],
  		// 用户卡片显示
    	cardDisplay:false,
        cardInfo:'',
        // 玩法介绍
        introDisplay:false,
        introContent:'',
        // 下载广告
        adDisplay:true,
        half_enter: true,
        half_group:[false,false,false],
    	game:{
    		showTip:false,
    		showClock:false,
    		tipClass:'',
    		tip:'',
    		time:5,
    		poker_group:[false,false,false],
    		mask:[false,false,false],
            // 投注数
            catNum1:0,
            catNum2:0,
            catNum3:0,
            // 倍率
            rate_first:0,
            rate_second:0,
            rate_third:0,
            // 牌组
            cardsSet1:[],
            cardsSet2:[],
            cardsSet3:[],
            // 结果
            result1:'',
            result2:'',
            result3:'',
            winIndex:'',
    	},
        // 猫和老鼠
        rc:{
            result_mask:false,
            mask:[false,false,false]
        },
        // 普通礼物连击
        gift_top:false,
        gift_bottom:false,
        gift_num_top:1,
        gift_num_bottom:1,
        // 礼物队列
        gift_line:[],
        // 礼物信息
        gift_info1:'',
        gift_info2:'',
        // 高级用户进入
        vip:{
            range:'',
            name:''
        },
        // 全局系统消息
        trumpet:{
            name:'',
            content:''
        },
        // 飘屏大礼物
        hugeGift:{
            sender_icon:'',
            sender_name:'',
            gift_name:'',
            gift_icon:''
        },
        // 玩法介绍
        gameRules:[
            {
                content:'欢乐斗牛是一款休闲益智的卡牌游戏。游戏开始的时候奇奇，趣趣，欢欢会拿到五张彩虹卡牌。您可以给你喜欢的小牛仔赠送彩虹糖。游戏结束后，胜利的小牛仔会给你相应的回报，输的小牛仔只能默默带走你的礼物。',
                rules:'<p>1、五张卡牌任意3张相加是10的倍数，剩余两张相加取个位数是几就是牛几。</p><p>银牛：五张卡牌中有一张牌是10，其余都比10大。</p><p>金牛：五张牌都是10以上的。</p><p>炸弹：5张牌中有4张牌是一样的。</p><p>十小：5张牌都小于5，且5张牌相加不大于10</p><p>2、欢乐斗牛的卡牌大小顺序依次为：十小>炸弹>金牛>银牛>牛牛.....>牛一>没牛</p><p>3、若卡牌组合相同时，比较最大卡牌数字大小；最大卡牌数字相同时，比较最大卡牌的标示大小，黑桃>红桃>梅花>方块</p>'
            },
            {
                content:'会拿到五张彩虹卡牌。您可以选择支持的一方赠送彩虹糖。游戏结束后，胜利的一方会给你相应的回报，输的只能默默带走你的礼物。偶尔会出现平局的情况，猜中平局杰西和山姆将给你6倍礼物作为奖励哦！',
                rules:'<p>1、五张卡牌任意3张相加是10的倍数，剩余两张相加取个位数是几就是牛几。</p><p>银牛：五张卡牌中有一张牌是10，其余都比10大。</p><p>金牛：五张牌都是10以上的。</p><p>炸弹：5张牌中有4张牌是一样的。</p><p>十小：5张牌都小于5，且5张牌相加不大于10</p><p>2、猫和老鼠的卡牌大小顺序依次为：十小>炸弹>金牛>银牛>牛牛.....>牛一>没牛，牌型相同则算为平局。</p>'
            }
        ]
  	},
    updated:function(){
      
    },
  	mounted:function(){
  		// this.$nextTick(function () {
  			var _this = this;
            _this.live_id = parseInt(_this.getQueryString('liveId'));
  			// 获取直播间数据
  			$.ajax({
                method: "GET",
                url: "/api/rainbow/liveDetail",
                dataType: 'json',
                data: {
                	liveId:_this.live_id,
   					// userId:2
                },
                success: function(data) {
                    _this.roomid = data.object.info.chat_room_id;
                    _this.gameType = data.object.info.gameId;
                    // 预发布
                    _this.accid = 'test_'+data.object.info.userId;
                    // _this.accid = data.object.info.userId;
                    _this.info = data.object.info;
                    _this.state = _this.info.state;
                    // _this.state = 1;
                    _this.otherLive = data.object.otherLive;
                    // 获取游戏数据
                    _this.getGameInfo();
                    if(_this.gameType==1){
                        _this.leftarr = [];
                        // 欢乐牛牛卡牌定位
                        Vue.nextTick(function(){
                            _this.top = $('.poker-area').eq(0).offset().top;
                            for(var i=0;i<3;i++){
                                _this.leftarr.push($('.poker-area').eq(i).offset().left);
                            }
                            console.log(_this.leftarr);
                        })
                    }else if(_this.gameType==2){           
                        _this.leftarr = [];
                        Vue.nextTick(function(){
                            _this.top = $('.poker-area').eq(0).offset().top;
                            for(var i=0;i<2;i++){
                                _this.leftarr.push($('.m-rc .poker-area').eq(i).offset().left);
                            }
                            console.log(_this.leftarr);
                        })           
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
  		// })
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
        getGameInfo:function(){
            var _this = this;
            // $.ajax({
            //     method: "GET",
            //     url: "/api/rainbow/game/introduce",
            //     dataType: 'json',
            //     data: {
            //         gameId:_this.info.gameId,
            //     },
            //     success: function(data) {
            //         _this.introContent = data.object;
            //     },
            //     error: function(a, b, c) {
            //         console.log("接口出问题啦");
            //     }
            // });
            $.ajax({
                method: "GET",
                url: "/api/rainbow/gameInfo",
                dataType: 'json',
                data: {
                    gameId:_this.info.gameId,
                },
                success: function(data) {
                    _this.game.rate_first = data.object.rate_first;
                    _this.game.rate_second = data.object.rate_second;
                    _this.game.rate_third = data.object.rate_third;
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        },
        // 数量计算
        watchNum: function (num) {
            return num>10000 ? (num/10000).toFixed(1)+'w' : num;
        },
  		// 用户卡片
    	showCard:function(id){
    		this.cardDisplay = true;
    	},
        getUserInfo:function(){
            var _this = this;
            $('.icon-toplist').click(function(){
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
                        _this.cardInfo = data.object;
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });
                _this.cardDisplay = true;
            })
        },
    	// 关闭弹框
    	closeCard:function(){
    		this.cardDisplay = false;      		
    	},
        // 显示玩法介绍
        showIntro:function(){
            var _this = this;
            _this.introDisplay = true;
        },
        // 关闭玩法介绍
        closeIntro:function(){
            this.introDisplay = false;
        },
        // 关闭下载
        closeAd:function(){
            this.adDisplay = false;
        },
        download:function(){
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yuerlive.rainbow";
        },
  	}
})