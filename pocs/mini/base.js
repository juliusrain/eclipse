// CANVAS stuff
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#fff';
ctx.strokeStyle = '#fff';
ctx.lineWidth = 1.1;
var CW = canvas.width,
	HCW = canvas.width/2,
	CH = canvas.height,
	HCH = canvas.height/2,
	EDGES = 100;

// MISC functions
function dist(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}
function rando(min, max, floor) {
	var r = Math.random() * (max - min) + min;
	if(floor){
		r = Math.floor(r);
	}
	return r;
}
function insideRect(x1, y1, x2, y2) {
	var insideX, outsideX, insideY, outsideY;
	if(x1 <= x2){insideX = x1;outsideX = x2;}
	else{insideX = x2;outsideX = x1;}
	if(y1 <= y2){insideY = y1;outsideY = y2;}
	else{insideY = y2;outsideY = y1;}
	return (function (x, y) {
		if(x >= x1 && x <= x2){
			if(y >= y1 && y <= y2){
				return true;
			}
		}
		return false;
	});
}


//user inputs
var keyers = [],
	mouser = {x:0, y:0},
	interactions = {};
	interactions2 = {};
$(window).keydown(function (e) {
	if(keyers.indexOf(e.keyCode)==-1 && typeof e.keyCode){keyers.push(e.keyCode);}
	if(e.keyCode === 38 /*up*/ ||
			e.keyCode === 40 /*down*/ ||
			e.keyCode === 32 /*spacebar*/){
		return false;
	}
});
$(window).keyup(function (e) {
	keyers.splice(keyers.indexOf(e.keyCode), 1);
});
$(canvas).mousemove(function (e){
	var pos = $(canvas).offset();
	mouser.x = e.clientX - pos.left;
	mouser.y = e.clientY - pos.top;
});
$(canvas).click(function (e){
	var i,
		pos = $(canvas).offset(),
		x = e.clientX - pos.left,
		y = e.clientY - pos.top,
		done = false;
	for(i in interactions){
		console.log('trying '+i+'; '+x+':'+y);
		console.log(interactions[i].inside(x, y));
		if(interactions[i].inside(x, y)){
			console.log('worked!');
			interactions[i].execute();
			done = true;
		}
	}
	if(!done){
		for(i in interactions2){
			console.log('trying '+i+'; '+x+':'+y);
			console.log(interactions2[i].inside(x, y));
			if(interactions2[i].inside(x, y)){
				console.log('worked!');
				interactions2[i].execute();
				done = true;
			}
		}
	}
});