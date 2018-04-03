// JavaScript Document
import jQuery from 'jquery'
(function($){
	$.fn.myScroll = function(options){
	var defaults = {
		speed:40,
		rowHeight:24,
    time: 3000
	};

	var opts = $.extend({}, defaults, options),intId = [];

	function marquee(obj, step){

		obj.find("ul").animate({
			marginTop: - opts["rowHeight"]
		},opts["speed"],'swing',function(){
				var s = Math.abs(parseInt($(this).css("margin-top")));
        $(this).find("li").slice(0, 1).appendTo($(this));
        $(this).css("margin-top", 0);
			});
		}

		this.each(function(i){
			var sh = opts["rowHeight"],
          time = opts["time"] + opts["speed"],
          _this = $(this);
			intId[i] = setInterval(function(){
				if(_this.find("ul").height()<=_this.height()){
					clearInterval(intId[i]);
				}else{
					marquee(_this, sh);
				}
			}, time);

			_this.hover(function(){
				clearInterval(intId[i]);
			},function(){
				intId[i] = setInterval(function(){
					if(_this.find("ul").height()<=_this.height()){
						clearInterval(intId[i]);
					}else{
						marquee(_this, sh);
					}
				}, time);
			});

		});

	}

})(jQuery);
