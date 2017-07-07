var friendRegister = new Vue({
  	el: '#friendRegister',
  	delimiters: ['${', '}'],
  	data: {
        regPic:'',
        phone:'',
        code:'',
        codeError:'',
        messageCodeError:'',
        regText:'获取验证码',
        // 短信验证码
        messCode:'',
        // 获取验证码是否点击
        regdis:false,
        //邀请人昵称
        nickName:'',
  	},
  	mounted:function(){
  		this.$nextTick(function () {
        var _this = this;
        var userId = _this.getQueryString('userId');
        // var userId = 1000183;
  	   /*去掉iphone手机滑动默认行为*/
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        $('.set').hide();
        $('.noset').show();
        $('.g-checkCodeMask').hide();
        this.codeError = '';
        this.messageCodeError = '';
            $.ajax({
              url: '/webapi/rainbow/invite/inviter?invite_user_id='+userId,
              type: 'get',
              success: function(data) {
                 if(data.code == 0){
                    _this.nickName = data.result;
                 }else if(data.code == -1){
                    layer.open({
                      content: '用户不存在',
                      btn: '好的',
                      shadeClose: false,
                    });
                 }else if(data.code == -5){
                    layer.open({
                      content: '参数错误',
                      btn: '好的',
                      shadeClose: false,
                    });
                 }else{
                   layer.open({
                    content: '服务器出错',
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
  		});
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
       // 图形验证码
        showPic:function(type){
            var _this = this;
            if(type==0){
                if(_this.phone){
                    if(/^1[34578][0-9]{9}$/.test(_this.phone)){
                        $.ajax({
                            url: '/webapi/checkCode?phone='+_this.phone,
                            type: 'get',
                            success: function(data) {
                               _this.code = '';
                               _this.regPic = '/webapi/checkCode?phone='+_this.phone+'&rand='+new Date();
                               $('.g-checkCodeMask').show();
                            },
                            error: function() {
                                layer.open({
                                  content: '网络异常，请刷新重试',
                                  btn: '好的',
                                  shadeClose: false,
                                });
                            }
                        });                        
                    }
                    else{
                         _this.messageCodeError = '手机号码错误';
                        setTimeout(function(){
                           _this.messageCodeError = '';
                        },2000);
                    }
                }else{
                     _this.messageCodeError = '请输入手机号';
                        setTimeout(function(){
                           _this.messageCodeError = '';
                        },2000);
                   
                }                       
            }else{
                console.log('没有传参');
            }
        },
        //改变图形验证码
        changePic:function(){
            this.regPic = '/webapi/checkCode?phone='+this.phone+'&rand='+new Date();
        },
        // 校验验证码
        checkCode:function(){
            var _this = this;
            if(_this.code){
                if(_this.code.length<4){
                    _this.codeError = '手机验证码错误';
                    setTimeout(function(){
                        _this.codeError = '';
                    },2000); 
                }else{

                }
            }else{
                _this.coderror = '请手机输入验证码';
                setTimeout(function(){
                    _this.codeError = '';
                },2000); 
            }                   
        },

        //弹出框取消
        codeCancel:function(){
            $('.g-checkCodeMask').hide();
        },
        //弹出框确定(校验验证码)
        codeConfirm:function(e){
            var _this = this;
            if(_this.code){
                if(_this.code.length<4){
                    _this.regPic = '/webapi/checkCode?phone='+_this.phone+'&rand='+new Date();
                    _this.codeError = '手机验证码错误';
                    setTimeout(function(){
                        _this.codeError = '';
                    },2000); 
                }else{
                     $.ajax({
                        url: '/webapi/verifyCheckCode?phone='+_this.phone+'&checkCode='+_this.code,
                        type: 'get',
                        dataType: 'json',
                        success: function(data) {
                            if(data.code==0){
                               $('.g-checkCodeMask').hide();
                               $.ajax({
                                  url: '/webapi/sendSMSCode',
                                  data:{
                                    mobile:_this.phone,
                                    type:3
                                  },
                                  type: 'get',
                                  dataType: 'json',
                                  success: function(data) {
                                        var second = 59;
                                        _this.regdis = true;
                                        _this.regText = second+'(s)';
                                        function settime(val) { 
                                            if (second > 0) { 
                                                $('.u-getCode').removeClass('fc-f36').addClass('fc-grey');
                                                _this.regText = second+'(s)重新获取';
                                                second--;
                                                setTimeout(function() { 
                                                    settime(val) 
                                                },1000);
                                            } else {
                                                $('.u-getCode').removeClass('fc-b6').addClass('fc-grey');
                                                _this.regdis = false;
                                                _this.regText = '获取验证码';                             
                                            } 
                                        } 
                                        settime(second);
                                  },
                                  error: function() {
                                      layer.open({
                                        content: '网络异常，请刷新重试',
                                        btn: '好的',
                                        shadeClose: false,
                                      });
                                  }
                               });                       
                            }else if(data.code==-3){
                               _this.regPic = '/webapi/checkCode?phone='+_this.phone+'&rand='+new Date();
                                _this.codeError = '手机验证码错误';
                                setTimeout(function(){
                                    _this.codeError = '';
                                },2000); 
                            }else if(data.code == -5){
                                 _this.codeError = '请输入验证码';
                                 setTimeout(function(){
                                     _this.codeError = '';
                                 },2000); 
                            }else{
                              layer.open({
                               content: '服务器出错',
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
                }
            }else{
                _this.codeError = '请输入验证码';
                setTimeout(function(){
                    _this.codeError = '';
                },2000); 
            }                   
           
        },
        //接受邀请
        acceptInvite:function(){
           var _this = this;
            if(/^1[34578][0-9]{9}$/.test(_this.phone) && _this.messCode.length==6){
                var userId = _this.getQueryString('userId');
                // var userId = 1000183;
                var parm = {};
                parm.smsCode = _this.messCode;
                parm.mobile = _this.phone;
                parm.invite_user_id = userId;
                $.ajax({
                    url: '/webapi/rainbow/invite/inviteRegist',
                    type: 'get',
                    data:parm,
                    dataType: 'json',
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true,
                    },  
                    success: function(data) {
                        if(data.code == 0){
                            if(data.extend.inviteMsg){
                               //好友邀请达到上限提示语
                                layer.open({
                                  content: '你的好友当月邀请额度已用完,继续注册无法获得奖励,是否继续'
                                  ,btn: ['继续', '取消']
                                  ,yes: function(index){
                                    layer.close(index);
                                    window.location.href = '/activity/download';
                                  }
                                });
                            }else{
                                window.location.href = '/activity/download';
                            }
                        }else if(data.code == -2){
                          layer.open({
                             content: '用户已存在',
                             btn: '好的',
                             shadeClose: false,
                          });
                        }else if(data.code == -3){
                          layer.open({
                             content: '邀请人不存在',
                             btn: '好的',
                             shadeClose: false,
                          });
                        }else if(data.code == -5){
                          layer.open({
                             content: '参数错误',
                             btn: '好的',
                             shadeClose: false,
                          });
                        }else if(data.code == -1){
                          layer.open({
                             content: '验证码不正确',
                             btn: '好的',
                             shadeClose: false,
                          });
                        }else{
                          layer.open({
                             content: '服务器出错',
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
            }else if(_this.phone ==''){
                _this.messageCodeError = "手机号码不能为空";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }else if(!/^1[34578][0-9]{9}$/.test(_this.phone)){
                _this.phoneError = "手机号码错误，请重新输入";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }else if(_this.messCode==''){
                _this.messageCodeError = "验证码不能为空";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }else if(_this.messCode!='' && _this.messCode.length<6){
                _this.messageCodeError = "验证码错误，请重新输入";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }           
        },
  	}
})