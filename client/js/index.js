rainbow = new Vue({
  	el: '#room',
  	delimiters: ['${', '}'],
  	data: {
        // 直播间数据
        info:'',
  		// 直播间id
  		live_id:'',
  		accid:'test_1000109',
  		roomid:'9428957',
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
    	// 直播结束
    	is_live_end:false,
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
        // 普通礼物连击
        gift_top:false,
        gift_bottom:false,
        gift_num_top:1,
        gift_num_bottom:1,
        // 礼物队列
        gift_line:[],
  	},
    updated:function(){
        // $('.icon-toplist').click(function(){
        //     // alert($(this).attr('data-id'));
        //     var that = this;
        //     $.ajax({
        //         method: "GET",
        //         url: "/api/rainbow/userInfo",
        //         dataType: 'json',
        //         data: {
        //             otherId:$(that).attr('data-id'),
        //             // userId:2
        //         },
        //         success: function(data) {

        //         },
        //         error: function(a, b, c) {
        //             console.log("接口出问题啦");
        //         }
        //     });
        // })
    },
  	mounted:function(){
  		// this.$nextTick(function () {
  			var _this = this;
            
  			// 获取直播间数据
  			$.ajax({
                method: "GET",
                url: "/api/rainbow/liveDetail",
                dataType: 'json',
                data: {
                	liveId:_this.getQueryString('liveId'),
   					// userId:2
                },
                success: function(data) {
                    // _this.roomid = data.object.info.chat_room_id;
                    _this.roomid = 9466782;
                    _this.accid = 'test_'+data.object.info.userId;
                    _this.info = data.object.info;
                    // _this.audienceList = data.object.audienceList;
                    // console.log($('.icon-toplist').length)
                    Vue.nextTick(function () {
                        _this.getUserInfo();
                    })
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
            // 游戏玩法
            $.ajax({
                method: "GET",
                url: "/api/rainbow/game/introduce",
                dataType: 'json',
                data: {
                    gameId:1,
                },
                success: function(data) {
                    _this.introContent = data.object;
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
        }
  	}
})