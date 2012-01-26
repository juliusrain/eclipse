function sizeGame(){
	if(window.innerWidth > 600 && window.innerHeight > 500){
		sizeElements();
		resizePlayWindow();
	}
}
function sizeElements(){
	var ww = window.innerWidth,
		wh = window.innerHeight,
		centerTop,
		centerBottom,
		centerHeight;
	$("#top").css({
		'width':ww,
		'top':0,
		'left':0,
	});
	centerTop = parseInt($("#top").height())+10;
	$("#bottom").css({
		'width':ww,
		'top':wh-(parseInt($("#bottom").css("height"))*3),
		'left':0,
	});
	centerBottom = wh-(parseInt($("#bottom").css("height"))*3);
	centerHeight = centerBottom - centerTop;
	$("#left").css({
		'width':ww/6,
		'height':centerHeight,
		'top':centerTop,
		'left':0,
	});
	$("#right").css({
		'width':ww/6,
		'height':centerHeight,
		'top':centerTop,
		'left':5*ww/6,
	});
	$("#middle").css({
		'width':4*ww/6,
		'height':centerHeight,
		'top':centerTop,
		'left':ww/6,
	});
};
window.onload = sizeGame;
window.onresize = sizeGame;

