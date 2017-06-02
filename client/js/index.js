var rainbow = new Vue({
  	el: '#room',
  	delimiters: ['${', '}'],
  	data: {
    	cardDisplay:false,
  	},
  	mounted:function(){
  		this.$nextTick(function () {
  			var pokerNum = 0;
  			var leftarr = [];
  			for(var i=0;i<3;i++){
  				leftarr.push($('.poker-box ul').eq(i).offset().left);
  			}
  			var top = $('.poker-box ul').eq(0).offset().top;
  			var width = $('.deal-section li').eq(0).width();
  			var height = $('.deal-section li').eq(0).height();
  			function dealPoker(){
  				if(pokerNum<15){
  					if(pokerNum<5){
						$('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[0]+width/2+0.35*width*(pokerNum%5)},500);
						pokerNum++;
	  					if(pokerNum==5){
	  						setTimeout(function(){ 					
		  						dealPoker();
		  					},200);
	  					}else{
	  						setTimeout(function(){ 					
		  						dealPoker();
		  					},50);
	  					}
	  				}else if(pokerNum<10){
	  					$('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[1]+width/2+0.35*width*(pokerNum%5)},500);
						pokerNum++;
	  					if(pokerNum==10){
	  						setTimeout(function(){ 					
		  						dealPoker();
		  					},200);
	  					}else{
	  						setTimeout(function(){ 					
		  						dealPoker();
		  					},50);
	  					}
	  				}else{
	  					$('.deal-section li').eq(pokerNum).addClass('rotate').animate({"top":top+height/2,"left":leftarr[2]+width/2+0.35*width*(pokerNum%5)},500);
						pokerNum++;
	  					setTimeout(function(){ 					
	  						dealPoker();
	  					},50);
	  				}
  				}
  			}
  			dealPoker();
  		})
  	},
  	methods: {
  		// 用户卡片
    	showCard:function(id){
    		this.cardDisplay = true;
    	},
    	// 关闭弹框
    	closeCard:function(){
    		this.cardDisplay = false;      		
    	}
  	}
})