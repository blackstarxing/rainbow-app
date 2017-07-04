$('.invite-info i').on('click',function(){
	$('.m-invite-mask').show();
	$('body').on('touchmove',function(e){
		e.preventDefault();
	})
})

$('.u-close').on('click',function(){
	$('.m-invite-mask').hide();
	$('body').unbind('touchmove');
})