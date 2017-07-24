var rechargeLogin = new Vue({
    el: '#rechargeLogin',
    delimiters: ['${', '}'],
    data: {
      	userId:''
    },
    mounted:function(){
      this.$nextTick(function () {
          // 展开得到ID的步骤
          $('.g-getId').on('click',function(){
            $('.m-getId-step').addClass('active');
          });
          var _this = this;
          $.ajax({
                url: '/webapi/pay/checkAuth',
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                      withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
                    
                  }else if(data.code == 302){
                    window.location.href = data.result;
                  }else{
                    layer.open({
                      content: '授权失败',
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
         
        })
    },
    methods: {
        // 点击完成操作
        getId:function(){
        	  var _this = this;
            if(_this.userId.length == 7){
                $.ajax({
                  url: '/webapi/pay/userInfo?userId='+_this.userId,
                  type: 'get',
                  dataType:'json',
                  success: function(data) {
                    if(data.code == 0){
                       //userID缓存
                       window.localStorage.setItem("userId", _this.userId);
                       window.location.href = '/Recharge/rainbowCandy';
                    }else{
                      layer.open({
                        content: 'id输入有误,请重新输入'
                        ,skin: 'msg'
                        ,time: 2 //2秒后自动关闭
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
            }else if(_this.userId == ''){
                layer.open({
                    content: '请输入ID',
                    btn: '好的',
                    shadeClose: false,
                });
            }else if(_this.userId.length != 7){
                layer.open({
                    content: 'id输入有误,请重新输入'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
            }
       
        }      
    }
})
