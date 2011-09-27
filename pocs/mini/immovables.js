/*
	needed:
		- create parent "Immovable" class (and possibly find a better name)
		- create "Station" class (for friendly or enemy)
		- create moons? (child class to Planet)
*/
function Planet(x, y, size) {
	this.x = x;
	this.y = y;
	this.size = size;
}
Planet.prototype.draw = function (dx, dy) {
	ctx.save();
	ctx.translate(HCW-dx, HCH-dy);
	
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
	ctx.strokeStyle = '#fff';
	ctx.lineWidth = 1.1;
	ctx.stroke();
	ctx.fillStyle = '#800';
	ctx.fill();
	
	ctx.restore();
};
Planet.prototype.blip = function (x, y) {
	var ny, nx, off = false;
	while(Math.abs(x) > HCW || Math.abs(y) > HCH){
		off = true
		if(HCH < HCW){
			ny = y > 0 ? HCH - 5 : -HCH + 5;
			nx = ((y / ny) * x);
		}
		else{
			nx = x > 0 ? HCW - 5 : -HCW + 5;
			ny = ((x / nx) * y);
		}
		x = nx;
		y = ny;
	}

	//console.log('blip: '+x+":"+y);
	
	ctx.save();
	ctx.translate(HCW, HCH);
	
	if(off){
		ctx.fillStyle = '#00f';
		ctx.fillRect(x-2.5, y-2.5, 5, 5);
	}
	else{
		ctx.beginPath();
		ctx.arc(x, y, this.size * 0.025, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1.1;
		ctx.strokeStyle = '#00f';
		ctx.stroke();
	}
	
	ctx.restore();
};